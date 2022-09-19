import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/models/policy';
import { PolicyResponseModel } from 'src/app/models/policyResponseModel';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  
  title = "Fortigate 1500D Filter and İnstall Policy";
  zoneGroup = {};
  zoneGroup2 = {};
  fileName="All_Zones.xlsx"
  token:any;
  policies: Policy[] = []
  searchText:any;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {

  }

  groupByType(array: any) {

    return array.reduce((r: any, a: any) => {
      r[a.srcintf[0].name] = r[a.srcintf[0].name] || [];
      r[a.srcintf[0].name].push(a);
      return r;
    }, Object.create(null));
  }
  

  exportAllExcel():void{
    let element=document.getElementById('excel-allTable')

    const ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet(element);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,'AllZones');
    XLSX.writeFile(wb,this.fileName);
    
  }
  exportExcel( zoneName:string,tableFileName:string):void{
    let element=document.getElementById(zoneName)

    const ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet(element);
    const wb:XLSX.WorkBook=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,tableFileName);
    XLSX.writeFile(wb,tableFileName+".xlsx");
    
  }

  getPolicy() {
    
    this.token =document.getElementById('token')
    const headerDict = {
      'Access-Control-Allow-Origin': "https://fwweb.ksm",
      'Access-Control-Allow-Methods': 'GET',
      'Content-Type': 'application/json',
    }

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    this.httpClient
      .get<any>('api/v2/cmdb/firewall/policy?access_token='+this.token.value, requestOptions)
      .subscribe((data) => {
        console.log(data);

        for (let index = 0; index < data.results.length; index++) {
          let item: Policy = new Policy();

          item.policyid = data.results[index].policyid;
          item.name = data.results[index].name;
          item.dstintf = data.results[index].dstintf[0].name;
          item.srcintf = data.results[index].srcintf[0].name;
          for (let i = 0; i < data.results[index].dstaddr.length; i++) {
            item.dstaddr[i] = data.results[index].dstaddr[i].name;
          }
          for (let i = 0; i < data.results[index].srcaddr.length; i++) {
            item.srcaddr[i] = data.results[index].srcaddr[i].name;
          }
          item.schedule = data.results[index].schedule;
          for (let i = 0; i < data.results[index].service.length; i++) {
            item.service[i] = data.results[index].service[i].name;
          }
          this.policies.push(item);
        }
        this.zoneGroup = this.groupByType(data.results);
        this.zoneGroup2=this.groupByType(data.results);
        console.log(this.zoneGroup);
      });
  }
}

