import React, { Component } from 'react';
import './App.css';
import ReactTable from 'react-table';
import "react-table/react-table.css";
import { RadioGroup, RadioButton } from 'react-radio-buttons';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      burstTime: '',
      arrivalTime: '',
      algorithm: ''
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

  selectAlgorithm = event => {
    this.setState({ algorithm: event })
  } 

  handleChange = event => {
      this.setState({ [event.target.name]: event.target.type === 'number' ? parseInt(event.target.value) : event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    let joined = this.state.data.concat({ burstTime: this.state.burstTime, remainingTime: this.state.burstTime, arrivalTime: this.state.arrivalTime })
    this.setState({ data: joined })
    this.setState({ burstTime: "", arrivalTime: "" });
    
  }

  handleCalculation = event => {
    event.preventDefault();
    switch(this.state.algorithm) {
      case 'sjf':
      console.log('Calculating SJF..');
      this.calculateSJF(this.state.data);
      break;
      case 'srt':
      console.log('Calculating SRT..');
      this.calculateSRT(this.state.data);
      break;
      case 'fcfs':
      console.log('Calculating FCFS..');
      this.calculateFCFS(this.state.data);
      break;
      case 'rr':
      console.log('Calculating RR Fixed..');
      this.calculateRR(this.state.data);
      break;
      default:
      console.log('Error: Please select a algorithm');
    }
  }

  calculateRR(data) {
    let n = data.length;
    let waitTime = new Array(n), turnAroundTime = new Array(n);
    let totalWT = 0, totalTAT = 0;

    this.findWaitTimeRR(data, n, waitTime);
  }

  findWaitTimeRR(data, n, waitTime) {

  }

  calculateFCFS(data) {
    let n = data.length;
    let waitTime = new Array(n), turnAroundTime = new Array(n);
    let totalWT = 0, totalTAT = 0;

    this.findWaitTimeFCFS(data, n, waitTime);

    this.findTurnAroundTimeSJF(data, n, waitTime, turnAroundTime);

    for (let i = 0; i < n; i++) {
      totalWT = totalWT + waitTime[i];
      totalTAT = totalTAT + turnAroundTime[i];
      let joined = {...this.state.data}

      joined[i].waitTime = waitTime[i]
      joined[i].turnAroundTime = turnAroundTime[i]

      this.setState({ joined })
    }
    console.log('Average WT: ', totalWT/n, 'Average TAT: ', totalTAT/n);
  }

  findWaitTimeFCFS(data, n, waitTime) {
    let service_time = new Array(n);
    service_time[0] = 0;
    waitTime[0] = 0;
    let gantt = '';

    //sort based on arrival time
    for(let i=0;i<n;i++)
    {
        for(let j=i+1;j<n;j++)
        {
           if(data[i].arrivalTime > data[j].arrivalTime)
           {
           let temp = data[i];
           data[i] = data[j];
           data[j] = temp;
           }
         }
    }

    this.setState({ data })


    for (let i = 1; i < n; i++) {
      service_time[i] = service_time[i-1] + data[i-1].burstTime;

      waitTime[i] = service_time[i] - data[i].arrivalTime;

      if (waitTime[i] < 0) {
        waitTime[i] = 0;
      }
    }
  }

  calculateSRT(data) {
    let n = data.length;
    let waitTime = new Array(n), turnAroundTime = new Array(n);
    let totalWT = 0, totalTAT = 0;
    
    this.findWaitTimeSRT(data, n, waitTime);

    this.findTurnAroundTimeSJF(data, n, waitTime, turnAroundTime);

    for (let i = 0; i < n; i++) {
      totalWT = totalWT + waitTime[i];
      totalTAT = totalTAT + turnAroundTime[i];
      let joined = {...this.state.data}

      joined[i].waitTime = waitTime[i]
      joined[i].turnAroundTime = turnAroundTime[i]

      this.setState({ joined })
    }
    console.log('Average WT: ', totalWT/n, 'Average TAT: ', totalTAT/n);
  }

  findWaitTimeSRT(data, n, waitTime) {
    let rt = new Array(n);
    let gantt = '';

    for (let i = 0; i < n; i++) {
      rt[i] = data[i].remainingTime;
    }

    let complete = 0, time = 0, minm = Number.MAX_VALUE;
    let shortest = 0, finishTime;
    let check = false;

    while (complete !== n) {

      for (let j = 0; j < n; j++) {
        if ((data[j].arrivalTime <= time) && (rt[j] < minm) && (rt[j] > 0)) {
          minm = rt[j];
          shortest = j;
          check = true;
        }
      }

      console.log('Current job: ', shortest+1, 'Current Time: ', time);

      gantt += '|'+time + "  Pid:" + shortest+1+'  '

      if (check === false) {
        time++
        continue;
      }

      rt[shortest]--;

      minm = rt[shortest];
      if (minm === 0) {
        minm = Number.MAX_VALUE;
      }

      if (rt[shortest] === 0) {
        complete++;
        check = false;

        finishTime = time + 1;

        console.log('Current job: ', shortest+1, 'Current Time: ', finishTime);

        gantt += finishTime+'|';

        waitTime[shortest] = finishTime - data[shortest].burstTime - data[shortest].arrivalTime;

        if (waitTime[shortest] < 0) {
          waitTime[shortest] = 0;
        }
      }
      time++;
    }
    console.log(gantt);
  }

  calculateSJF(data) {
    let n = data.length;
    let waitTime = new Array(n), turnAroundTime = new Array(n);
    let totalWT = 0, totalTAT = 0; 

    this.findWaitTimeSJF(data, n, waitTime); 

    this.findTurnAroundTimeSJF(data, n, waitTime, turnAroundTime);

    for (let i = 0; i < n; i++) {
      totalWT = totalWT + waitTime[i];
      totalTAT = totalTAT + turnAroundTime[i];
      let joined = {...this.state.data}

      joined[i].waitTime = waitTime[i]
      joined[i].turnAroundTime = turnAroundTime[i]

      this.setState({ joined })
    }
    console.log('Average WT: ', totalWT/n, 'Average TAT: ', totalTAT/n);
  }

  findWaitTimeSJF(data, n, waitTime) {
    let rt = new Array(n);
    let gantt = '';

    for (let i = 0; i < n; i++) {
      rt[i] = data[i].burstTime;
    }

    let complete = 0, time = 0, minm = Number.MAX_VALUE;
    let shortest = 0, finishTime;
    let check = false;

    while (complete !== n) {

      if (!check) {
        for (let j = 0; j < n; j++) {
            if ((data[j].arrivalTime <= time) && (rt[j] < minm) && (rt[j] > 0)) {
              minm = rt[j];
              shortest = j;
              check = true;
            }
        }
      }
      

      console.log('Current job: ', shortest+1, 'Current Time: ', time);

      gantt += '|'+time + "  Pid:" + shortest+1+'  '

      if (check === false) {
        time++
        continue;
      }

      rt[shortest]--;
      

      minm = rt[shortest];
      if (minm === 0) {
        minm = Number.MAX_VALUE;
      }

      if (rt[shortest] === 0) {
        complete++;
        check = false;

        finishTime = time + 1;

        console.log('Current job: ', shortest+1, 'Current Time(finish): ', finishTime);
        gantt += finishTime+'|';

        waitTime[shortest] = finishTime - data[shortest].burstTime - data[shortest].arrivalTime;

        if (waitTime[shortest] < 0) {
          waitTime[shortest] = 0;
        }
      }
      time++;
    }
    console.log(gantt);
  }

  findTurnAroundTimeSJF(data, n, wt, tat) {
    for (let i = 0; i < n; i++) {
      let time = data[i].burstTime + wt[i];
      tat[i] = time;
    }
  } 

  renderEditable = cellInfo => {
    return (
      <div
        style={{ backgroundColor: "#fafafa" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
          this.setState({ data });
        }}
        dangerouslySetInnerHTML={{ __html: this.state.data[cellInfo.index][cellInfo.column.id] }}
      />
    );
  };

  render() {
    const { data } = this.state;
    console.log(this.state)
    return (
      <div className="App">
        <div className="App-intro">
        <div>
          <RadioGroup onChange={this.selectAlgorithm} horizontal>
            <RadioButton value="sjf">
              Shortest Job First
            </RadioButton>
            <RadioButton value="srt">
              Shortest Remaining Time
            </RadioButton>
            <RadioButton value="fcfs">
              First Come First Serve
            </RadioButton>
            <RadioButton value="prio">
              Priority
            </RadioButton>
          </RadioGroup>
        </div>
          <form onSubmit={this.handleSubmit}>
            <h3>Add new process</h3>
            <label>
              BurstTime:
              <input 
                type="number"
                name="burstTime"
                value={this.state.burstTime}
                onChange={this.handleChange}
              />
            </label>
            <label>
              ArrivalTime:
              <input 
                type="number"
                name="arrivalTime"
                value={this.state.arrivalTime}
                onChange={this.handleChange}
              />
            </label>

            <input type="submit" value="Add"/>
          </form>
          <form onSubmit={this.handleCalculation}>
            <input type="submit" value="Calculate"/>
          </form>
        </div>
        <div>
          <ReactTable
            data={data}
            columns={[
              {
                Header: "ProcessID",
                accessor: "processID",
                Cell: (row) => {
                  return <div>{row.index+1}</div>
                }
              },
              {
                Header: "Burst Time",
                accessor: "burstTime",
                Cell: this.renderEditable
              },
              {
                Header: "Arrival Time",
                accessor: "arrivalTime",
                Cell: this.renderEditable
              },
              {
                Header: "Wait Time",
                accessor: "waitTime",
                Cell: this.renderEditable
              },
              {
                Header: "Turn Around Time",
                accessor: "turnAroundTime",
                Cell: this.renderEditable
              }
            ]}
            defaultPageSize={10}
            className="-striped -highlight"
          />
        </div>
      </div>
    );
  }
}

export default App;
