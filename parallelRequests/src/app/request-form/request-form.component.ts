import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Subject} from 'rxjs';
import {take, takeUntil } from 'rxjs/operators';
import {InfoService} from "../services/info.service";

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
  providers:[InfoService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestFormComponent implements OnInit, OnDestroy {
  paramsReceived = false;
  count = 0;
  delay = 0;
  logs: string[] = [];
  destroy$ = new Subject<void>();

  constructor(private readonly infoService: InfoService,
              private readonly  changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.infoService.sendParamsRequest().pipe(take(1)).subscribe({
        next: (response: any) => {
          this.count = +response.count;
          this.delay = +response.delay;
          this.paramsReceived = true;
          this.changeDetector.markForCheck();
        },
        error: (error) => {
          console.error('Error fetching params:', error);
        }
      }
    );
  }

  sendProcessRequests(): void {
    this.infoService.sendProcessRequests(this.count,this.delay).pipe(takeUntil(this.destroy$)).subscribe({
        next:(log) => {
          this.logs.push(log);
          this.changeDetector.markForCheck();
        },
        error: (err)=> {
          console.error('Error sending process request:', err);
        }
      }
    );
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }
}
