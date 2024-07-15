import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import CHANNEL_NAME from '@salesforce/messageChannel/Asset_Disconnection__c';

export default class DisconnectionNotice extends LightningElement {
    subscription = {};
    status;
    identifier;
    
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.handleSubscribe();
    }

    renderedCallback(){
        
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

        if (this.status === true){
            this.showSuccessToast(this.identifier);
        } else {
            this.showErrorToast();
        }
    }
    
    handleUnsubscribe(){
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    disconnectedCallback() {
        //Implement your unsubscribing solution here
        this.handleUnsubscribe();
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