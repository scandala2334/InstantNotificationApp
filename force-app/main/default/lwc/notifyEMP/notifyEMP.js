import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError } from "lightning/empApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class NotifyEMP extends LightningElement {
    //@track
    identifier;
    status;
    notifications = [];
    
    handleNotificationEvent(event) {
        console.dir(event);
        // Parse event data
        const id = event.data.event.replayId;
        //const message = event.data.event.replayId;
        const message = event.data.payload.Asset_Identifier__c;
        const status = event.data.payload.Disconnected__c;
        this.identifier = message;
        this.status = status;
        // Add notification to view
        const notification = {
          id,
          message,
          status
        };
        this.notifications.push(notification);
        // Show notification message as a toast
        this.dispatchEvent(
          new ShowToastEvent({
            variant: "info",
            title: message,
            message: status
          })
        );
      }

    async connectedCallback() {
        // Configure default error handler for the EMP API
        onError((error) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    variant: "error",
                    title: "EMP API Error",
                    message: "Check your browser's developer console for mode details."
                })
            );
            console.log("EMP API error reported by server: ", JSON.stringify(error));
        });
        // Subscribe to our notification platform event with the EMP API
        // listen to all new events
        // and handle them with handleNotificationEvent
        this.subscription = await subscribe(
            "/event/Asset_Disconnection__e",
            -1,
            (event) => this.handleNotificationEvent(event)
        );
        // Display a toast to inform the user that we're ready to receive notifications
        this.dispatchEvent(
            new ShowToastEvent({
            variant: "success",
            title: "Ready to receive notifications"
            })
        );        
    }  
    disconnectedCallback() {
        // Unsubscribe from EMP API
        unsubscribe(this.subscription);
    }  

}