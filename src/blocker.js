chrome.storage.local.get(["blockedSites", "sessions"], (storage) => {
    if (!storage.blockedSites || !storage.sessions) return;
    const host = window.location.host;
    let hostName = host.includes('www') ? host.split('.')[1] : host.split('.')[0];

    const domainNames = storage.blockedSites.map(site => {
        return site.split('.')[0];
    });
    if (!domainNames.includes(hostName)) return;

    const currentDate = new Date();
    for (let i = 0; i < storage.sessions.length; i++) {
        const session = storage.sessions[i];
        console.log(session);
        if (session.isPaused) {
            break;
        }
        if (session.days.includes(currentDate.getDay())) {
            let startDate = new Date();
            startDate.setHours(session.startTime.split(":")[0]);
            startDate.setMinutes(session.startTime.split(":")[1]);
            startDate.setSeconds(session.startTime.split(":")[2]);
            console.log(startDate);

            let endDate = new Date();
            endDate.setHours(session.endTime.split(":")[0]);
            endDate.setMinutes(session.endTime.split(":")[1]);
            endDate.setSeconds(session.endTime.split(":")[2]);

            if (startDate < currentDate && endDate > currentDate) {
                window.location = chrome.runtime.getURL("page-blocked.html");
                break;
            }
        }
    }
});
