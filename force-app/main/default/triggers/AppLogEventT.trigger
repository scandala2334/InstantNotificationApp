trigger AppLogEventT on thsecurity__AppLogEvent__e (after insert) {
    
    // Define Variable
    List<Error_Log__c> elist = new List<Error_Log__c>();
    
    // Process Records
    for(thsecurity__AppLogEvent__e th :Trigger.new){
        Error_Log__c eHold = new Error_Log__c();
            eHold.Async_Apex_Job_Id__c = th.ReplayId;
            eHold.Type__c = th.thsecurity__Log_Level__c;
            eHold.Stacktrace__c = th.thsecurity__Class__c;
            eHold.Message__c = th.thsecurity__Message__c;
        elist.add(eHold);
    }

    // Write the log records
    insert elist;
}