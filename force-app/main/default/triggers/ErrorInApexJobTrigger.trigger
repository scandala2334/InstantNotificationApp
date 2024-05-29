trigger ErrorInApexJobTrigger on BatchApexErrorEvent (after insert) {
    Set<Id> asyncApexJobIds = new Set<Id>();
    for(BatchApexErrorEvent evt: Trigger.new){
        asyncApexJobIds.add(evt.AsyncApexJobId);
    }

    // Create Variables
    Map<Id,AsyncApexJob> jobs = new Map<Id,AsyncApexJob>([SELECT id, ApexClass.Name FROM AsyncApexJob WHERE Id IN :asyncApexJobIds]);
    List<Error_Log__c> records = new List<Error_Log__c>();

    // Process Trigger Records only process PilotRatingBatch
    for(BatchApexErrorEvent evt: Trigger.new){
        if(jobs.get(evt.AsyncApexJobId).ApexClass.Name == 'PilotRatingBatch'){
            // Create Log Record
            Error_Log__c e = new Error_Log__c();
                e.Stacktrace__c = jobs.get(evt.AsyncApexJobId).ApexClass.Name;
                e.Async_Apex_Job_Id__c = evt.AsyncApexJobId;
                e.Job_Scope__c = evt.ExceptionType;
                e.Message__c = evt.JobScope;
            records.add(e); 
        }
    }
    insert records;
}