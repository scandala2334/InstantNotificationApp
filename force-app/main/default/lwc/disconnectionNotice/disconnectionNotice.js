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

        const messageCallback = function (response) {
            const status = response.data.payload.Disconnected__c;
            const identifier = response.data.payload.Asset_Identifier__c;
            this.status = status;
            this.identifier = identifier; 
            console.log('New message received: ', JSON.stringify(response));
            if (status === true){
                console.log('In Loop True: ', JSON.stringify(response.data.payload.Disconnected__c));
                this.showSuccessToast(identifier);
            } else {
                console.log('In Loop False: ', JSON.stringify(response.data.payload.Disconnected__c));
                this.showErrorToast();
            }
        }

        /*const messageCallback = function (response) {
            console.log('New message received: ', JSON.stringify(response.data.payload.Disconnected__c));
            // Response contains the payload of the new message received
        };*/

        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, 
            -1, 
            messageCallback).then((response) => {
            // Response contains the subscription information on subscribe call
            console.log(
                'Subscription request sent to: ',
                //JSON.stringify(response.channel)
                JSON.stringify(response)
            );
            this.subscription = response;
            });
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