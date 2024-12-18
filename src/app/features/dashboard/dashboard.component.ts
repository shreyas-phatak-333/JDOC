import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js'; 

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.createChart();
  }

  createChart(): void {
    const canvas = this.el.nativeElement.querySelector('#myChart');
    const chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [{
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true, 
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    const ctx1 = this.el.nativeElement.querySelector('#myChart2');;
    const myChart2 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr'],
            datasets: [{
                label: 'Dataset 1',
                data: [65, 59, 80, 81],
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        }
    });
  }

}
