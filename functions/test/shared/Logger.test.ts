import { 
    Logger,
    LogLevel
} from "../../src/shared";
  
describe('Logger', () => {
test('info', async () => {
    delete console.log; console.log = jest.fn();
    Logger.setLogLevel(LogLevel.debug);

    Logger.info("Test Message");
    expect(console.log).toHaveBeenCalledWith("Test Message")
});

test('info (multiple)', async () => {
    delete console.log; console.log = jest.fn();
    Logger.setLogLevel(LogLevel.debug);

    Logger.info("Test Message", {test: "Test Message"});
    expect(console.log).toHaveBeenCalledWith("Test Message", JSON.stringify({test: "Test Message"}, null, 4))
});

test('warn', async () => {
    delete console.warn; console.warn = jest.fn();
    Logger.setLogLevel(LogLevel.debug);

    Logger.warn("Test Message");
    expect(console.warn).toHaveBeenCalledWith("Test Message")
});

test('error', async () => {
    delete console.error; console.error = jest.fn();
    Logger.setLogLevel(LogLevel.debug);

    Logger.error("Test Message");
    expect(console.error).toHaveBeenCalledWith("Test Message")
});

test('debug', async () => {
    delete console.trace; console.trace = jest.fn();
    Logger.setLogLevel(LogLevel.debug);

    Logger.debug("Test Message");
    expect(console.trace).toHaveBeenCalledWith("Test Message")
});

test('jsonify (text)', async () => {
    Logger.setLogLevel(LogLevel.debug);
    expect(Logger.jsonify([
    "Test Message"
    ])).toEqual([
    "Test Message"
    ])
});

test('jsonify (object)', async () => {
    Logger.setLogLevel(LogLevel.debug);
    expect(Logger.jsonify([
    {test: "Test Message"}
    ])).toEqual([
    JSON.stringify({test: "Test Message"}, null, 4)
    ])
});

test('jsonify (mixed)', async () => {
    Logger.setLogLevel(LogLevel.debug);
    expect(Logger.jsonify([
    "Test Message", 
    { test: "Test Message" }
    ])).toEqual([
    "Test Message",
    JSON.stringify({test: "Test Message"}, null, 4)
    ])
});  
});
  
