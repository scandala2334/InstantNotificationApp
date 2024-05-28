// Trigger for listening to Order Events 
trigger OrderEventTrigger on Order_Event__e (after insert) {
	//List to hold all tasks
	List<Task> tasks = new List<Task>();

    //Iterage through each notification
    for(Order_Event__e event: Trigger.New){
        if(event.Has_Shipped__c == true){
            task holdTask = new task();
            	holdTask.priority = 'Medium';
            	holdTask.subject = 'Follow up on shipped order 105';
            	holdTask.OwnerId = event.CreatedById;
            tasks.add(holdTask);
        }
    }
    insert tasks;
}