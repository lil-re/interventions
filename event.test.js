const Event = require('./event.js')

beforeAll(() => {
    var startDate = new Date(2016,6,1,10,30); // July 1st, 10:30
    var endDate = new Date(2016,6,1,14,0); // July 1st, 14:00
    new Event(true, true, startDate, endDate); // weekly recurring opening in calendar

    startDate = new Date(2016,6,8,11,30); // July 8th 11:30
    endDate = new Date(2016,6,8,12,30); // July 8th 12:30
    new Event(false, false, startDate, endDate); // intervention scheduled
})

test('Group all openings and transform their dates into timestamps', () => {
    expect(Event.openings()).toStrictEqual([
        [
            1467361800000,
            1467374400000,
        ],
    ]);
});

test('Group all interventions and transform their dates into timestamps', () => {
    expect(Event.interventions()).toStrictEqual([
        [
            1467970200000,
            1467973800000,
        ],
    ]);
});

test('Check openings and reload the old ones if it is necessary', () => {
    const openings = Event.openings()
    const checkedOpenings = Event.checkOpenings(openings, 1467619200000, 1468137600000)
    
    expect(checkedOpenings).not.toStrictEqual(openings)
    expect(checkedOpenings).toStrictEqual([
        [
            1467966600000,
            1467979200000,
        ],
    ])
});

test('Generate the availabilities', () => {
    const openings = Event.openings()
    const interventions = Event.interventions()
    const checkedOpenings = Event.checkOpenings(openings, 1467619200000, 1468137600000)
    const availabilities = Event.generateAvailabilities(checkedOpenings, interventions)

    expect(availabilities).toStrictEqual([
        [
            1467966600000,
            1467970200000,
        ],
        [
            1467973800000,
            1467979200000,
        ],
    ])
});

test('Print the availabilities', () => {
    const openings = Event.openings()
    const interventions = Event.interventions()
    const checkedOpenings = Event.checkOpenings(openings, 1467619200000, 1468137600000)
    const availabilities = Event.generateAvailabilities(checkedOpenings, interventions)
    const text = Event.printAvailabilities(availabilities)

    expect(text).toBe(`
Availabilities :
From Fri Jul 08 2016 10:30:00 GMT+0200 (heure d’été d’Europe centrale) to Fri Jul 08 2016 11:30:00 GMT+0200 (heure d’été d’Europe centrale)
From Fri Jul 08 2016 12:30:00 GMT+0200 (heure d’été d’Europe centrale) to Fri Jul 08 2016 14:00:00 GMT+0200 (heure d’été d’Europe centrale)
`)
});
