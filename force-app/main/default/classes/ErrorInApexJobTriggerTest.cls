/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest 
private class ErrorInApexJobTriggerTest {

    @isTest
    static void myUnitTest() {
        // TO DO: implement unit test
        // Run Test

        Contact ct = new Contact();
            ct.LastName = 'whodd';
            ct.Pilot_Rating__c = 4;
        insert ct;

        Mission__c m = new Mission__c();
            m.Status__c = 'Complete';
            m.Pilot__c = ct.id;
            m.Subject__c = 'New Mission for test';
            m.Completion_Rating__c = 5;
            m.Overall_Rating__c = 5;
            m.Safety_Incidents__c = 0;
        insert m;

        try{
            Test.startTest();
                PilotRatingBatch prb = new PilotRatingBatch();
                Id batchId = Database.executeBatch(prb);
            
            Test.stopTest();
        } catch (Exception e){

        }
        
        Test.getEventBus().deliver();

        // Verify that it wrote
        List<Error_Log__c> dl = [SELECT id from Error_Log__c];
        System.assertEquals(1, dl.size()); 
    }
}
