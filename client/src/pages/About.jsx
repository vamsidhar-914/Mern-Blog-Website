import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>About Vamsi's blog</h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>Vamsi's Blog is a blog that I created to share my thoughts and ideas with the world.I love to write about my experiences and things that I have learned.
              I hope you enjoy this webiste
            </p>
            <p>
              On this blog , you'll find weekly articleson topics such as Art , Music,Category,etc...And you can create,update,delete,read articles and blogs.so be sure to check back often for new content.
            </p>
            <p>
              we encourage you to leave comments on users posts and engage with others.You can like other people's posts and reply to them as well. we believe that a community of learners can help each other grow and improve
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
