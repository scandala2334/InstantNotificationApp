@isTest
public class AppLogEventTTest {
    @isTest static void methodName(){

        // Test Data    
        thsecurity__AppLogEvent__e levent = new thsecurity__AppLogEvent__e();
            levent.thsecurity__Class__c = 'PilotRatingBatch';
            levent.thsecurity__Log_Level__c = 'Big';
            levent.thsecurity__Message__c = 'There was an error';        

        // Run Test
        Test.startTest();
            Database.SaveResult sr = EventBus.publish(levent);
        Test.stopTest();

        // Verify that it wrote
        System.assertEquals(true, sr.isSuccess());

        List<Error_Log__c> dl = [SELECT id from Error_Log__c];
        System.assertEquals(1, dl.size());
    }
}