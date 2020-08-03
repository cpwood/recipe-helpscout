let lastPolled = new Date(2020, 1, 1);

module.exports = (Franz) => {
  const getMessages = function getMessages() {
    let count = 0;
    let now = new Date();

    if (document.location.href == "https://secure.helpscout.net/") {
      // Data readily-available on homepage via App.data
      lastPolled = now;

      let mailboxes = App.data.favMailboxes.models;

      mailboxes.forEach(m => {
        count = count + m.attributes.folders.unassigned.count + m.attributes.folders.mine.count + m.attributes.folders.needsattn.count;
      });

      // set Franz badge
      Franz.setBadge(count);
    }
    else {
      // For other pages, poll once a minute
      if (now - lastPolled > 60000) {
        lastPolled = now;

        $.get( "/", function( data ) {
          let html = /"mailboxes":([^\]]+?\])/.exec(data)[1];
          let mailboxes = JSON.parse(html);
  
          mailboxes.forEach(m => {
            count = count + m.folders.unassigned.count + m.folders.mine.count + m.folders.needsattn.count;
          });
  
          // set Franz badge
          Franz.setBadge(count);
        });
      }
    }
  };

  // check for new messages every second and update Franz badge
  Franz.loop(getMessages);
}

