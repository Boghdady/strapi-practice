"use strict";

/**
 * post service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::post.post", ({ strapi }) => ({
  async findPublicPosts(args) {
    const newQuery = {
      ...args,
      filters: {
        ...args.filters,
        premium: false,
      },
    };

    const publicPosts = await strapi.entityService.findMany(
      "api::post.post",
      this.getFetchParams(newQuery)
    );
    return publicPosts;
  },

  async findIfPublicPost(args) {
    const { id, query } = args;

    const post = await strapi.entityService.findOne(
      "api::post.post",
      id,
      query
    );

    return post.premium ? null : post;
  },

  async likePost(args) {
    const { postId, userId, query } = args;

    // use the underlying entityService api to fetch post, and it's likedBy property
    const postToLike = await strapi.entityService.findOne(
      "api::post.post",
      postId,
      {
        populate: ["likedBy"],
      }
    );
    console.log(query);
    // use the underlying entityService api to update current post with new relation
    const updatedPost = await strapi.entityService.update(
      "api::post.post",
      postId,
      {
        data: {
          likedBy: [...postToLike.likedBy, userId],
        },
        ...query,
      }
    );

    return updatedPost;
  },
}));
