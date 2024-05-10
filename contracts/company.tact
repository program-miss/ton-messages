import "@stdlib/deploy";
message Deposit {
    amount: Int as uint32;
    queryId: Int as uint32;
}

contract Company with Deployable {
    balance: Int as uint256;
    init(){
        self.balance = 0;
    }

    // шаг 2: от фонда
    receive(msg: Deposit){
        self.balance = (self.balance + msg.amount); // из тестов 7n
    }

    get fun balance(): Int {
        return self.balance; // из тестов 3n
    }
}
