import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { SprintService } from 'src/app/shared/services/sprint/sprint.service';
import { Sprint } from 'src/app/shared/interface/sprint';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { UserStory } from 'src/app/shared/interface/user-story';
import { UserStoryService } from 'src/app/shared/services/user-story/user-story.service';

@Component({
  selector: 'app-burndown-chart',
  templateUrl: './burndown-chart.component.html',
  styleUrls: ['./burndown-chart.component.sass'],
  providers: [DatePipe]
})
export class BurndownChartComponent implements OnInit {
  sprint: Sprint;
  userStories: UserStory[];
  projectId: string;
  options = { month: 'long', day: 'numeric' };
  lineChartLabels: Date[] = [];
  lineChartOptions: {};
  lineChartData: ChartDataSets[];

  // lineChartData: ChartDataSets[] = [
  //   { data: [], label: 'Ideal line', lineTension: 0 },
  //   { data: [], label: 'Actual line', lineTension: 0 }
  // ];

  lineChartColors: Color[] = [
    {

    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  constructor(
    private sprintService: SprintService,
    private userStoryService: UserStoryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get("id");
    this.sprintService.getActiveSprint(this.projectId).subscribe(response => {
      this.sprint = response;
      if(!response) return;
      let startDate = this.sprint.startDate;
      let endDate = this.sprint.endDate;
      this.userStoryService.getUserStoriesForSprint(this.projectId, this.sprint.id).subscribe(response => {
        let maxStoryPoints = 0;
        let idealStoryPointSubtraction;
        let idealLine: number[] = [];
        let actualLine: number[] = [];
        let differenceInDays;
        this.userStories = response;
        this.userStories.forEach(userStory => {
          maxStoryPoints += userStory.story_points;
        })
        this.lineChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                suggestedMin: 0,
                suggestedMax: maxStoryPoints === 0 ? 5 : maxStoryPoints
              }
            }]
          }
        };

        this.lineChartLabels = this.getDateArray(startDate, endDate);
        differenceInDays = this.getDifferenceInDays(startDate, endDate)
        idealStoryPointSubtraction = maxStoryPoints / differenceInDays;

        for (let i = differenceInDays; i >= 0; i--) {
          idealLine.push(this.round(idealStoryPointSubtraction * i, 1));
        }

        let currentDate = new Date(startDate);
        let burndown = maxStoryPoints;
        for (currentDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
          if(currentDate.getTime() <= new Date().getTime()) {
            let userStories = this.userStories.filter(us => {
              return us.completionDate !== null && us.completionDate.getTime() === currentDate.getTime();
            });
  
            let totalStoryPoints = userStories.reduce((a, b) => a + b.story_points, 0);
            actualLine.push(burndown -= totalStoryPoints);
          }
        }

        this.lineChartData = []
        this.lineChartData.push(
          {
            data: idealLine,
            label: 'Ideal burndown',
            lineTension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          },
          {
            data: actualLine,
            label: 'Actual burndown',
            lineTension: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          }
        )
      });
    });
  }

  getDateArray(start, end) {
    let arr = new Array();
    let dt = new Date(start);

    while (dt <= end) {
      arr.push(new Date(dt).toLocaleString('en-US', this.options));
      dt.setDate(dt.getDate() + 1);
    }

    return arr;
  }

  getDifferenceInDays(start, end) {
    let diff = Math.abs(start.getTime() - end.getTime());
    let diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return diffDays;
  }

  round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
