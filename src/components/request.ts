import { ContentChild, Directive, EventEmitter, Input, Output } from '@angular/core';
import { Http } from '@mbamobi/http';
import { StateContent, StateEmpty, StateError, StateLoading } from './states';

@Directive({
  selector: '[request]'
})
export class Request {
  @Input() url: string;
  @Input() params: Object;
  @Input() requestOptions: any;
  @Input() options: any;
  @Input() requestOnInit: boolean = true;

  @Output() loaded = new EventEmitter();
  @Output() onError = new EventEmitter();

  @ContentChild(StateLoading) loading: any;

  @ContentChild(StateEmpty) noRecords: any;

  @ContentChild(StateError) error: any;

  @ContentChild(StateContent) content: any;

  get _requestOptions() {
    // default options
    let pluginsOptions = {
      '*': {
        'skip': true,
        'throwsException': false
      }
    };
    let requestOptions = Object.assign(
      {},
      { pluginsOptions, retry: true },
      this.options
    );

    return requestOptions;
  }

  constructor(
    private http: Http
  ) {}

  ngOnInit() {

    if (this.requestOnInit) {
      this.request();
    }

    if (this.error) {
      this.error.retry.subscribe(() => {
        this.request();
      });
    }
  }

  request() {
    this.dismissError();
    this.dismissNoRecords();
    this.dismissContent();

    if (this.loading) {
      this.loading.present();
    }

    this.http.request(
      this.url,
      this.params,
      this._requestOptions,
      this.options
    ).subscribe((result: any) => {
      this.dismissLoading();

      if (this.noRecords) {
        this.noRecords.response = result;
        let isPresent = this.noRecords.present();

        if (!isPresent) {
          this.loaded.emit(result);
          this.presentContent();
        }
      } else {
        this.loaded.emit(result);
        this.presentContent();
      }
    }, (error) => {
      this.dismissLoading();

      this.onError.emit(error);

      if (this.error) {

        if (!this.error.error) {
          this.error.error = error;
        }

        this.error.present();
      }
    });
  }

  private dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
    }
  }

  private dismissError() {
    if (this.error) {
      this.error.dismiss();
    }
  }

  private dismissNoRecords() {
    if (this.noRecords) {
      this.noRecords.dismiss();
    }
  }

  private dismissContent() {
    if (this.content) {
      this.content.dismiss();
    }
  }

  private presentContent() {
    if (this.content) {
      this.content.present();
    }
  }
}
