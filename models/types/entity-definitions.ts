import { EntityDefinition } from './entity-utils';
import { AddressEntity, AddressInput, AddressPublic, AddressKeys, createAddressEntityFromInput, toAddressPublic } from './address';
import { TemplateEntity, TemplateInput, TemplatePublic, TemplateKeys, createTemplateEntityFromInput, toTemplatePublic } from './template';
import { UserEntity, UserInput, UserPublic, UserKeys, createUserEntityFromInput, toUserPublic } from './user';
import { PopupEntity, PopupInput, PopupPublic, PopupKeys, createPopupEntityFromInput, toPopupPublic } from './popup';
import { NoticeEntity, NoticeInput, NoticePublic, NoticeKeys, createNoticeEntityFromInput, toNoticePublic } from './notice';
import { ReviewEntity, ReviewInput, ReviewPublic, ReviewKeys, createReviewEntityFromInput, toReviewPublic } from './review';
import { PointLogEntity, PointLogInput, PointLogPublic, PointLogKeys, createPointLogEntityFromInput, toPointLogPublic } from './point-log';
import { FaqEntity, FaqInput, FaqPublic, FaqKeys, createFaqEntityFromInput, toFaqPublic } from './faq';

// DynamoDB 테이블 이름
export const MAIN_TABLE_NAME = process.env.MAIN_TABLE_NAME || 'FromYouTable';

/**
 * 주소 엔티티 정의
 */
export const AddressDef: EntityDefinition<AddressEntity, AddressInput, AddressPublic> = {
  entityType: 'ADDRESS',
  keys: AddressKeys,
  createEntityFromInput: createAddressEntityFromInput,
  toPublic: toAddressPublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 템플릿 엔티티 정의
 */
export const TemplateDef: EntityDefinition<TemplateEntity, TemplateInput, TemplatePublic> = {
  entityType: 'TEMPLATE',
  keys: TemplateKeys,
  createEntityFromInput: createTemplateEntityFromInput,
  toPublic: toTemplatePublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 사용자 엔티티 정의
 */
export const UserDef: EntityDefinition<UserEntity, UserInput, UserPublic> = {
  entityType: 'USER', 
  keys: UserKeys,
  createEntityFromInput: createUserEntityFromInput,
  toPublic: toUserPublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 팝업 엔티티 정의
 */
export const PopupDef: EntityDefinition<PopupEntity, PopupInput, PopupPublic> = {
  entityType: 'POPUP',
  keys: PopupKeys,
  createEntityFromInput: createPopupEntityFromInput,
  toPublic: toPopupPublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 공지사항 엔티티 정의
 */
export const NoticeDef: EntityDefinition<NoticeEntity, NoticeInput, NoticePublic> = {
  entityType: 'NOTICE',
  keys: NoticeKeys,
  createEntityFromInput: createNoticeEntityFromInput,
  toPublic: toNoticePublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 리뷰 엔티티 정의
 */
export const ReviewDef: EntityDefinition<ReviewEntity, ReviewInput, ReviewPublic> = {
  entityType: 'REVIEW',
  keys: ReviewKeys,
  createEntityFromInput: createReviewEntityFromInput,
  toPublic: toReviewPublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 포인트 로그 엔티티 정의
 */
export const PointLogDef: EntityDefinition<PointLogEntity, PointLogInput, PointLogPublic> = {
  entityType: 'POINT_LOG',
  keys: PointLogKeys,
  createEntityFromInput: createPointLogEntityFromInput,
  toPublic: toPointLogPublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * FAQ 엔티티 정의
 */
export const FaqDef: EntityDefinition<FaqEntity, FaqInput, FaqPublic> = {
  entityType: 'FAQ',
  keys: FaqKeys,
  createEntityFromInput: createFaqEntityFromInput,
  toPublic: toFaqPublic,
  tableName: MAIN_TABLE_NAME,
};

/**
 * 모든 엔티티 정의 객체를 내보냅니다.
 */
export const EntityDefs = {
  Address: AddressDef,
  Template: TemplateDef,
  User: UserDef,
  Popup: PopupDef,
  Notice: NoticeDef,
  Review: ReviewDef,
  PointLog: PointLogDef,
  Faq: FaqDef,
}; 