import React from "react";
import Post from "../../libs/Post/Post";


const PostItem = () => {
    return (
        <div className = "asdasd" >
        <Post
            id={1}
            title={"진라면 맛있게 끓이는 법"}
            category={"요리"}
            views={50}
            likes={50}
            liked={false}
            comments={30}
            hashtags={["해시태그1", "해시태그2", "해시태그3"]}
          />
          <Post
            id={2}
            title={"태환아 공부좀 하자"}
            category={"가전"}
            views={150}
            likes={200}
            liked={true}
            comments={63}
            hashtags={["React", "Js", "Node"]}
          />

          </div>
    )
}

export default PostItem;