let lastPolled = new Date(2020, 1, 1);

module.exports = (Franz) => {
  const getMessages = function getMessages() {
      let now = new Date();

      // Only poll once a minute
      if (now - lastPolled > 60000) {
        lastPolled = now;

        let count = 0;

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
  };

  // check for new messages every second and update Franz badge
  Franz.loop(getMessages);
}

