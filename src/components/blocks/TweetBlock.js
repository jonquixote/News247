import React, { useEffect, useRef } from 'react';

const TweetBlock = ({ tweetId }) => {
  const tweetRef = useRef(null);

  useEffect(() => {
    // Load Twitter widget script
    const script = document.createElement('script');
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);

    // Render the tweet
    if (window.twttr && window.twttr.widgets) {
      window.twttr.widgets.createTweet(tweetId, tweetRef.current, {
        align: 'center'
      });
    }

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, [tweetId]);

  return <div ref={tweetRef} className="tweet-block"></div>;
};

export default TweetBlock;