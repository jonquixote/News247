import React from 'react';
import { Card } from '../ui/card';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const TweetBlock = ({ tweetId }) => {
  if (!tweetId) {
    return (
      <Card className="overflow-hidden relative mb-4 px-4 py-0">
        <div className="text-red-500">Error: Tweet ID is missing</div>
      </Card>
    );
  }

  return (
    <div className="tweet-block-wrapper w-full max-w-full overflow-hidden my-1">
      <div className="twitter-tweet-embed-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <TwitterTweetEmbed tweetId={tweetId} />
      </div>
    </div>
  );
};

export default TweetBlock;