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

    handleSubscribe() {
        //Implement your subscribing solution here 
        this.subscription = subscribe (
            this.channelName, 
            -1, 
            (message) => this.handleMessage(message)
        )
    }

    handleMessage (message){
        const status = message.data.payload.Disconnected__c;
        const identifier = message.data.payload.Asset_Identifier__c;
        this.status = status;
        this.identifier = identifier; 
        console.log('New message received: ', JSON.stringify(message));

        const messageCallback = () => {
            if (this.status === true){
                console.log('In showToast True: ', JSON.stringify(this.identifier));
                this.showSuccessToast(this.identifier);
            } else {
                console.log('In showToast False: ', JSON.stringify(this.status));
                this.showErrorToast();
            }
        }
        messageCallback();
    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
        unsubscribe(this.subscription);
    }

    showSuccessToast(assetId) {
        console.log('In Toast True: ', JSON.stringify(this.status));
        const event = new ShowToastEvent({
            title: 'Success',
            message: 'Asset Id '+assetId+' is now disconnected',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    showErrorToast() {
        console.log('In Toast False: ', JSON.stringify(this.status));
        const event = new ShowToastEvent({
            title: 'Error',
            message: 'Asset was not disconnected. Try Again.',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }

    registerErrorListener() {
        // Invoke onError empApi method
        onError((error) => {
            console.log('Received error from server: ', JSON.stringify(error));
            // Error contains the server-side error
        });
    }
}