/* eslint-disable import/prefer-default-export */

function postLinkClickEvent(event) {
  if ([1, 3].includes(event.which)) { // ['Left click', 'Right click']
    if (event.currentTarget instanceof HTMLAnchorElement) {
      if (event.currentTarget.href.startsWith('http')) {
        if (!event.currentTarget.href.includes(process.env.VUE_APP_DOMAIN_URL)) {
          // stats
          fetch(`${process.env.VUE_APP_STATS_ENDPOINT}/link-click-event/`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              link_url: event.currentTarget.href,
            }),
          })
            .then((response) => response.json())
          // eslint-disable-next-line
          .then(data => {
            // console.log(data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  }
}

export {
  postLinkClickEvent,
};
