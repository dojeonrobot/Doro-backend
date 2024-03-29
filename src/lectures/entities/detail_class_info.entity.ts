/* eslint-disable prettier/prettier */
import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { boolean } from 'joi';
import { Core } from 'src/common/entity/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Overall_class_info } from './overall_class_info.entity';

@Entity()
@InputType({ isAbstract: true })
@ObjectType()
export class Detail_class_info extends Core {
  @Column()
  @Field((type) => String)
  class_name: string;

  @Column()
  @Field((type) => String)
  edu_concept: string;

  @Column()
  @Field((type) => Int)
  student_number: number;

  @Column('date', { array: true })
  @Field((type) => [Date])
  date: Date[];

  @Column()
  @Field((type) => String, { nullable: true, defaultValue: null })
  remark?: string;

  @Column()
  @Field((type) => Boolean)
  unfixed: boolean;

  @ManyToOne(
    (type) => Overall_class_info,
    (overall_class_info) => overall_class_info.Detail_class_infos,
    {
      onDelete: 'CASCADE',
    }
  )
  @Field((type) => Overall_class_info)
  Overall_class_info: Overall_class_info;
}
