import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import channelName from '@slaesforce/messageChannel/Asset_Disconnection__c';



export default class DisconnectionNotice extends LightningElement {
    subscription = null;
    status;
    identifier;
    channelName;

  
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.handleSubscribe();
    }

    handleMessage(message) {
        this.identifier = message.Asset_Identifier__c;
        this.status = message.status;
    }
    renderedCallback(){
        
    }

    handleSubscribe() {
        //Implement your subscribing solution here 
        if (!this.subscription){
            this.subscription = subscribe(
                this.messageContext,
                channelName,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE},
            );
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