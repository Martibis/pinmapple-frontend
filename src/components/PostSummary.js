const PostSummary = (props) => {
  console.log(props);
  return (
    <div className={"post-summary"}>
      <a href={props.marker.postLink} target="blank" className="image-link">
        {props.marker.postImageLink !== "No image" ? (
          <img
            src={
              "https://images.ecency.com/256x512/" + props.marker.postImageLink
            }
            alt=""
            loading="lazy"
          />
        ) : (
          <p className>No image found</p>
        )}
      </a>
      <div className="post-info">
        <h2 className="title">
          <a href={props.marker.postLink} target="blank">
            {props.marker.postTitle}
          </a>
        </h2>
        <div className="description">
          <p>{props.marker.postDescription}</p>
        </div>
        <div className="extra-info">
          <p>{"@" + props.marker.username}</p>
          {/* <p>{props.marker.postUpvote}</p>
          <p>{props.marker.postValue}</p> */}
        </div>
      </div>
    </div>
  );
};

export default PostSummary;
