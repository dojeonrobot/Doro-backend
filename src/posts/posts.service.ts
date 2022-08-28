import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, Not } from 'typeorm';
import {
  CheckPasswordInput,
  CheckPasswordOutput,
} from './dto/check-password.dto';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { CreatePostInput, CreatePostOutut } from './dto/create-post.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
import {
  FindAllCommentsInput,
  FindAllCommentsOutput,
} from './dto/find-all-comments.dto';
import {
  FindAllPostsInput,
  FindAllPostsOutput,
} from './dto/find-all-posts.dto';
import { FindPostInput, FindPostOutput } from './dto/find-post.dto';
import { UpdatePostInput, UpdatePostOutput } from './dto/update-post.dto';
import { Comment } from './entity/comment.entity';
import { Post } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private posts: Repository<Post>, // @InjectRepository(Comment) // private Comment: Repository<Post>,

    @InjectRepository(Comment)
    private comment: Repository<Comment>,
  ) {}
  async createPost(
    user: User,
    CreatePostInput: CreatePostInput,
  ): Promise<CreatePostOutut> {
    try {
      //로그인 회원
      if (user) {
        const newPost = this.posts.create({
          ownerId: user.id,
          ...CreatePostInput,
        });
        await this.posts.save(newPost);
        return {
          ok: true,
        };
      }
      //비로그인 회원
      else {
        const newPost = this.posts.create({
          ...CreatePostInput,
        });
        await this.posts.save(newPost);
        return {
          ok: true,
        };
      }
    } catch (e) {
      return {
        ok: false,
        error: 'could not make post',
      };
    }
  }

  async checkPassword(
    user: User,
    CheckPasswordInput: CheckPasswordInput,
  ): Promise<CheckPasswordOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: CheckPasswordInput.postId,
        },
      });
      if (user && user.role === 'Manager') {
        return { isSame: true, post };
      }
      if (post.password === CheckPasswordInput.password) {
        return { isSame: true, post };
      } else {
        return { isSame: false };
      }
    } catch {
      return {
        isSame: false,
      };
    }
  }

  async findPost(
    user: User,
    FindPostInput: FindPostInput,
  ): Promise<FindPostOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: FindPostInput.postId,
        },
      });
      console.log(post);
      //게시물이 존재하지 않음
      if (!post) {
        return {
          ok: false,
          error: 'there is no post',
        };
      }
      return {
        ok: true,
        post,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }
  async findAllPosts({ page }: FindAllPostsInput): Promise<FindAllPostsOutput> {
    try {
      const noticeCount = await this.posts.count({
        where: { password: 'doro2020' },
      });
      const [notices, noticeResults] = await this.posts.findAndCount({
        order: {
          id: 'DESC',
        },
        where: { password: 'doro2020' },
      });
      const [posts, totalResults] = await this.posts.findAndCount({
        order: {
          id: 'DESC',
        },
        where: { password: Not('doro2020') },
        skip: (page - 1) * (11 - noticeCount),
        take: 11 - noticeCount,
      });
      const Array = [...posts];
      const newArray = notices.concat(Array);
      const countResult = totalResults + noticeResults;

      return {
        ok: true,
        results: newArray,
        totalPages: Math.ceil(totalResults / (11 - noticeCount)),
        totalResults: countResult,
      };
    } catch {
      return {
        ok: false,
        error: 'could not load posts',
      };
    }
  }
  async updatePost(
    user: User,
    UpdatePostInput: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: UpdatePostInput.id,
        },
      });

      //게시물이 존재하지 않음
      if (!post) {
        return {
          ok: false,
          error: 'could not find post',
        };
      }
      await this.posts.update(
        { id: UpdatePostInput.id },
        { ...UpdatePostInput },
      );
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async deletePost(
    user: User,
    DeletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: DeletePostInput.postId,
        },
      });
      //게시물이 존재하지 않음
      if (!post) {
        return {
          ok: false,
          error: 'post does not exist try again',
        };
      }
      await this.posts.delete({ id: post.id });
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async createComment(
    user: User,
    CreateCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const post = await this.posts.findOne({
        where: { id: CreateCommentInput.postId },
      });
      if (!post) {
        return { ok: false, error: 'there is no post ' };
      }
      const newComment = this.comment.create({
        owner: user,
        ...CreateCommentInput,
        post,
      });
      await this.comment.save(newComment);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async findAllComments(
    FindAllCommentsInput: FindAllCommentsInput,
  ): Promise<FindAllCommentsOutput> {
    try {
      const comments = await this.comment.find({
        where: {
          post: { id: FindAllCommentsInput.postId },
        },
      });

      return {
        ok: true,
        comments,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async deleteComment(
    user: User,
    DeleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    try {
      const targetComment = await this.comment.findOne({
        where: {
          id: DeleteCommentInput.commentId,
        },
      });
      if (!targetComment) {
        return {
          ok: false,
          error: 'there is no comment',
        };
      }
      if (!targetComment.owner) {
        return {
          ok: false,
          error: 'there is no owner',
        };
      }
      if (targetComment.owner.id !== user.id && user.role !== 'Manager') {
        return {
          ok: false,
          error: 'you are not owner',
        };
      }
      await this.comment.delete(DeleteCommentInput.commentId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: true,
        error: e,
      };
    }
  }
}
