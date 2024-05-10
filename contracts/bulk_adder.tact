import "@stdlib/deploy";
message Reach {
    counter: Address;
    target: Int as uint32;
}
message CounterValue {
    amount: Int as uint32;
}

contract BulkAdder with Deployable {
    target: Int as uint32;
    init(){
        self.target = 0;
    }

    // шаг 1
    receive(msg: Reach){
        // Ошибки (bounced: true)
        // 1 способ:
        // если первый параметр false, то будет показываться ошибка (второй параметр)
        // require(msg.target <= 10, "target can't be more than 10");

        // 2 способ:
        if (msg.target > 10) {
            throw(123);
        }
        self.target = msg.target; // 5
        send(SendParameters{
                to: msg.counter,
                value: 0,
                mode: (SendRemainingValue + SendIgnoreErrors),
                body: "query".asComment()
            }
        );
    }

    // шаг 3
    receive(msg: CounterValue){
        if (self.target > msg.amount) {
            send(SendParameters{
                    to: sender(), // sender - Counter смарт-контракт
                    value: 0,
                    mode: (SendRemainingValue + SendIgnoreErrors),
                    body: "increment".asComment()
                }
            );
        }
    }
}
