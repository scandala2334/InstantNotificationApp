import { LightningElement } from 'lwc';
//import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';

import { subscribe, onError } from 'lightning/empApi';

export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    status = 'good';
    identifier = 'N/A';
    channelName = '/event/Asset_Disconnection__e';

    handleSubscribe() {

        const messageCallback = function(response){
            console.log(response.identifier);
            console.log(response.status);
            this.identifier = response.identifier;
            this.status = response.status;
        }
        subscribe(this.channelName, -1, messageCallback).then(response => {
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }
    connectedCallback() {
        // Configure default error handler for the EMP API
        onError((error) => {
            console.log("EMP API ---DISCONNECT--- error reported by server: ", JSON.stringify(error));
        });        
        this.handleSubscribe();
    }

    /*
    connectedCallback() {
        this.handleSubscribe();
    }

    renderedCallback(){
        
    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleSubscribe() {
        //Implement your subscribing solution here 
        this.subscription = subscribe(
            this.messageContext,
            CHANNEL_NAME,
            (message) => this.handleMessage(message),
        );
    }

    handleMessage(message) {
        
        this.identifier = message.Asset_Identifier__c;
        this.status = message.Disconnected__c;
        this.showSuccessToast(this.status);
/*
        if (this.status === true){
            this.showSuccessToast(this.identifier);
        } else {
            this.showErrorToast();
        }
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
*/
}