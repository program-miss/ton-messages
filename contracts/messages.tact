import "@stdlib/deploy";
// Добавление суммы к счетчику
message Add {
    amount: Int as uint32;
}
// Вычитание суммы из счетчика
message Subtract {
    amount: Int as uint32;
}
// Комлексная математическая операция на счетчике
message MultiMath {
    add: Int as uint32;
    subtract: Int as uint32;
    multiply: Int as uint32;
}

/* Сообщения:
 * Когда происходит компилляция кода из tact в func
 * каждое сообщение создает под собой уникальный идентификатор
 * по которому смарт-контракт и определяет,
 * какую логику выполнять при получении того или иного сообщения
 */

// Структура - нет идентификатора, как у сообщений
struct Operations {
    add: Int as uint32;
    subtract: Int as uint32;
    multiply: Int as uint32;
}

contract Messages with Deployable {
    val: Int as int64;
    init(){
        self.val = 0;
    }

    // Обработчик для получения TON без какого-либо сообщения
    receive(){}

    receive(msg: Add){
        self.val = (self.val + msg.amount);
    }

    receive(msg: Subtract){
        self.val = (self.val - msg.amount);
    }

    receive(msg: MultiMath){
        self.val = (self.val + msg.add);
        self.val = (self.val - msg.subtract);
        self.val = self.val * msg.multiply;
    }

    receive("increment"){
        self.val = (self.val + 1);
    }

    receive("decrement"){
        self.val = (self.val - 1);
    }

    // Если отправили текстовое сообщение и оно не совпало ни с одним из предыдущих текстовых значений
    receive(msg: String){}

    // Slice - открытая ячейка, в которой хранятся необработанные данные: адрес, строки, числа и т.п.
    // Сюда попадет сообщение, которое было не обработано ни по сообщению, ни по типу
    receive(msg: Slice){}
}
