const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 683;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Make sure to serve your public files
// Set EJS as the view engine
app.set('view engine', 'ejs');

// Function to count completed events
function countCompletedEvents(events) {
    let completedCount = 0;
    for (const event of events) {
        if (event.Completed === 'Yes') {
            completedCount++;
        }
    }
    return completedCount;
}

// Function to count completed events by region
function countCompletedEventsByRegion(events, region) {
    let completedCount = 0;
    for (const event of events) {
        if (event.Region === region && event.Completed === 'Yes') {
            completedCount++;
        }
    }
    return completedCount;
}

// Function to calculate completed events for a specific track
function calculateCompletedEventsForTrack(events, track) {
    let completedCount = 0;
    for (const event of events) {
        if (event.Track === track && event.Completed === 'Yes') {
            completedCount++;
        }
    }
    return completedCount;
}

let eventsData = JSON.parse(fs.readFileSync('events.json', 'utf8'));
let gpsData = JSON.parse(fs.readFileSync('gps.json', 'utf8'))

// Define a route that renders an EJS template
app.get('/', (req, res) => {
    eventsData = JSON.parse(fs.readFileSync('events.json', 'utf8'));
    gpsData = JSON.parse(fs.readFileSync('gps.json', 'utf8'))

    // Add incremental IDs to each event
    const eventsWithIds = eventsData.map((eventsData, index) => ({ ...eventsData, id: index + 1 }));
    // Write the events with IDs back to events.json
    fs.writeFileSync('events.json', JSON.stringify(eventsWithIds, null, 2));

    let waterfrontCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Waterfront');
    let downtownCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Downtown');
    let silverLakeCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Silver Lake');
    let lakesideGetawayCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Lakeside Getaway');
    let kingsOfTheRoadCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Kings of the Road');
    let mountainParkwayCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Mountain Parkway');
    let winterCityCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Winter City');
    let alpineCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Alpine');
    let rivieraCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Riviera');
    let vineyardCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Vineyard');
    let frozenPeakCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Frozen Peak');
    let coastalDreamCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Coastal Dream');
    let alpineExpresswayCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Alpine Expressway');
    let continentalRunCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Continental Run');
    let goldenCityCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Golden City');
    let docksideCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Dockside');
    let islandParadiseCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Island Paradise');
    let tropicalDriveCompletedCount = calculateCompletedEventsForTrack(eventsData, 'Tropical Drive');

    // Count completed events for each region in events.json
    const completedEventsUSA = countCompletedEventsByRegion(eventsData, 'USA');
    const completedEventsEurope = countCompletedEventsByRegion(eventsData, 'Europe');
    const completedEventsFarEast = countCompletedEventsByRegion(eventsData, 'Far East');

    // Count completed events for both events.json and gps.json
    const completedEvents = countCompletedEvents(eventsData);
    const completedGps = countCompletedEvents(gpsData);

    // Total completed events
    const totalCompletedEvents = completedEvents + completedGps;

    res.render('index', {
        waterfrontCompletedCount: waterfrontCompletedCount,
        downtownCompletedCount: downtownCompletedCount,
        silverLakeCompletedCount: silverLakeCompletedCount,
        lakesideGetawayCompletedCount: lakesideGetawayCompletedCount,
        kingsOfTheRoadCompletedCount: kingsOfTheRoadCompletedCount,
        mountainParkwayCompletedCount: mountainParkwayCompletedCount,
        winterCityCompletedCount: winterCityCompletedCount,
        alpineCompletedCount: alpineCompletedCount,
        rivieraCompletedCount: rivieraCompletedCount,
        vineyardCompletedCount: vineyardCompletedCount,
        frozenPeakCompletedCount: frozenPeakCompletedCount,
        coastalDreamCompletedCount: coastalDreamCompletedCount,
        alpineExpresswayCompletedCount: alpineExpresswayCompletedCount,
        continentalRunCompletedCount: continentalRunCompletedCount,
        goldenCityCompletedCount: goldenCityCompletedCount,
        docksideCompletedCount: docksideCompletedCount,
        islandParadiseCompletedCount: islandParadiseCompletedCount,
        tropicalDriveCompletedCount: tropicalDriveCompletedCount,

        completedEventsUSA: completedEventsUSA,
        completedEventsEurope: completedEventsEurope,
        completedEventsFarEast: completedEventsFarEast,
        completedEventsCountGps: completedGps,

        eventsData: eventsData,
        gpsData: gpsData,
        totalCompletedEvents: totalCompletedEvents
    });
});

// Route for marking an event as complete
app.post('/mark-complete', (req, res) => {
    const eventId = req.body.eventID.trim(); // Ensure eventId is a string

    let event = undefined
    if (req.body.isGP) {
        event = gpsData.find((e) => e.id.toString().trim() === eventId);
    } else {
        event = eventsData.find((e) => e.id.toString().trim() === eventId);
    }

    if (event) {
        event.Completed = 'Yes';

        fs.writeFileSync('events.json', JSON.stringify(eventsData, null, 2));
        fs.writeFileSync('gps.json', JSON.stringify(gpsData, null, 2));

        res.redirect('/');
    } else {
        res.status(404).send('Event not found');
    }
});

// Route for marking an event as incomplete
app.post('/mark-incomplete', (req, res) => {
    const eventId = req.body.eventID.trim();

    let event = undefined
    if (req.body.isGP) {
        event = gpsData.find((e) => e.id.toString().trim() === eventId);
    } else {
        event = eventsData.find((e) => e.id.toString().trim() === eventId);
    }

    if (event) {
        event.Completed = 'No';

        fs.writeFileSync('events.json', JSON.stringify(eventsData, null, 2));
        fs.writeFileSync('gps.json', JSON.stringify(gpsData, null, 2));

        res.redirect('/');
    } else {
        res.status(404).send('Event not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`The Tour De L'Unknown Crash Nav is running at http://localhost:${port}`);
    console.log(`Keep this window open when using the Crash Nav and use CTRL+C to close the window & stop the server.`)
});
