var eventList = [];
	
class Event {
    constructor(opening, recurring, startDate, endDate){
        this.opening = opening;
        this.recurring = recurring;
        this.startDate = startDate;
        this.endDate = endDate;
    
        eventList.push(this);
    }

    static checkOpenings (openings, fromTimestamp, toTimestamp) {
        const matchingOpenings = openings.filter(opening => opening[0] >= fromTimestamp && opening[1] <= toTimestamp)
        if (matchingOpenings.length === 0) {
            eventList
                .filter(event => event.opening && event.recurring && event.endDate.getTime() < fromTimestamp)
                .forEach(event => {
                    const newStart = event.startDate.getDate() + 7;
                    event.startDate.setDate(newStart)
                    const newEnd = event.endDate.getDate() + 7;
                    event.endDate.setDate(newEnd)
                })
            return Event.openings()
        }
        return openings
    }

    static generateAvailabilities (openings, interventions) {
        let results = [...openings]

        openings.forEach(opening => {
            interventions.forEach(intervention => {
                if (intervention[0] >= opening[0] && intervention[1] <= opening[1]) {
                    for (let i = 0; i < results.length; i++) {
                        const result = results[i]

                        if (intervention[0] >= result[0] && intervention[1] <= result[1]) {
                            results.splice(i, 1, ...[
                                [result[0], intervention[0]],
                                [intervention[1], result[1]]
                            ])
                            break
                        }
                    }
                }
            })
        })
        return results
    }

    static printAvailabilities (results) {
        let text = "\nAvailabilities :\n"
        results.forEach((result) => {
            const start = new Date(result[0])
            const end = new Date(result[1])
            text = `${text}From ${start.toDateString()} ${start.toTimeString()} to ${end.toDateString()} ${end.toTimeString()}\n`;
        })
        return text
    }

    static openings () {
        return eventList
            .filter(event => event.opening)
            .map(event => ([event.startDate.getTime(), event.endDate.getTime()]))
    }

    static interventions () {
        return eventList
            .filter(event => !event.opening)
            .map(event => ([event.startDate.getTime(), event.endDate.getTime()]))
    }

    static availabilities (fromDate, toDate){
        const fromTimestamp = fromDate.getTime()
        const toTimestamp = toDate.getTime()

        const openings = Event.openings()
        const interventions = Event.interventions()
        const checkedOpenings = Event.checkOpenings(openings, fromTimestamp, toTimestamp)
        const availabilities = Event.generateAvailabilities(checkedOpenings, interventions)
        const text = Event.printAvailabilities(availabilities)
        console.log(text);
    }
}

module.exports = Event
