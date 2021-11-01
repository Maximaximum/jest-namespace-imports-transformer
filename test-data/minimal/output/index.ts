import { Injectable } from "@angular/core";
import { gql } from "apollo-angular";
import {Mutation, Apollo as Apollo_1} from "apollo-angular";

export class TaskAttachmentCancelUploadGQL extends Mutation<
  string,
  number
> {
  constructor(apollo: Apollo_1) {
    super(apollo);
  }
}
