import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {
    subscribe,
    unsubscribe,
    onError,
    setDebugFlag,
    isEmpEnabled,
} from 'lightning/empApi';

export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    status;
    identifier;
    channelName;

    // Tracks changes to channelName text field
    handleChannelName(event) {
        this.channelName = event.target.value;
    }
    
    connectedCallback() {
        this.handleSubscribe();
    }

    renderedCallback(){
        
    }

    handleSubscribe() {
        //Implement your subscribing solution here
        const messageCallback = function (response) {
            console.log('New message received: ', JSON.stringify(response));
        };
    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
    }

    showSuccessToast(assetId) {
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Asset Id '+assetId+' is now disconnected',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Asset was not disconnected. Try Again.',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

}