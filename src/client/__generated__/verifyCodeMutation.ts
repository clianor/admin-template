/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VerifyCodeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: verifyCodeMutation
// ====================================================

export interface verifyCodeMutation_verifyCode {
  __typename: "VerifyCodeOutput";
  ok: boolean;
  error: string | null;
}

export interface verifyCodeMutation {
  verifyCode: verifyCodeMutation_verifyCode;
}

export interface verifyCodeMutationVariables {
  verifyCodeInput: VerifyCodeInput;
}
