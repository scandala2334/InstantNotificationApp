import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';
import REVENUE_FIELD from '@salesforce/schema/Account.AnnualRevenue'; 
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import { getRecord, getFieldValue} from 'lightning/uiRecordApi';

export class WireGetRecordProperty extends LightningElement{
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD]})
    account;
    get name(){
        return getFieldValue(this.account.data, NAME_FIELD);
    }    
}
export default class MyFirstWebComponent extends LightningElement {

    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD]})
    account;
    get name(){
        return getFieldValue(this.account.data, NAME_FIELD);
    }
    objectApiName = ACCOUNT_OBJECT;
    fields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD];
    handleSuccess(event){
        const toastEvent = new ShowToastEvent({
            title: "Account created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(toastEvent);
    }
    @track
    contacts = [
        {
            Id: 1,
            Name: 'Amy Taylor',
            Title: 'VP of Engineering',
        },
        {
            Id: 2,
            Name: 'Michael Jones',
            Title: 'VP of Sales',
        },
        {
            Id: 3,
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];
}