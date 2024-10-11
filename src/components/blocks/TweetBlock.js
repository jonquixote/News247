import React from 'react';
import { Card } from '../ui/card';
import { TwitterTweetEmbed } from 'react-twitter-embed';

const TweetBlock = ({ tweetId }) => {
  if (!tweetId) {
    return (
      <Card className="overflow-hidden relative mb-4 p-4">
        <div className="text-red-500">Error: Tweet ID is missing</div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden relative mb-4 p-4">
      <TwitterTweetEmbed
        tweetId={tweetId}
        options={{ align: 'center' }}
      />
    </Card>
  );
};

export default TweetBlock;