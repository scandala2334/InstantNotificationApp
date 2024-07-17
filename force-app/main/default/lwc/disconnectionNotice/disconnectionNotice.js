import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, onError } from "lightning/empApi";


export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    status;
    identifier;
    channelName = "/event/Asset_Disconnection__e";

    connectedCallback() {
        this.handleSubscribe();
    }

    renderedCallback(){
    }

    handleNotificationEvent(event) {
        const status = event.data.payload.Disconnected__c;
        const identifier = event.data.payload.Asset_Identifier__c;
        this.status = status;
        this.identifier = identifier; 
        
        if(status === true){
        this.showSuccessToast(identifier);
        } else {
            this.showErrorToast();
        }
    }

    async handleSubscribe() {
        //Implement your subscribing solution here 
        onError((error) => {
            this.showErrorToast();
            console.log("EMP API error reported by server: ", JSON.stringify(error));
        });

        this.subscription = await subscribe(  
            this.channelName,
            -1,
            (event) => this.handleNotificationEvent(event)
        );
    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
        unsubscribe(this.subscription);
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