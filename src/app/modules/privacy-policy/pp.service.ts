import { IPP } from './pp.interface';
import { PrivacyPolicy } from './pp.model';

const createPrivacyPolicyToDB = async (payload: IPP) => {
      console.log(payload);
      const result = await PrivacyPolicy.findOneAndReplace({ content: payload.content }, payload, {
            new: true,
            upsert: true,
      });

      return result;
};

const getPrivacyPolicyFromDB = async () => {
      const result = await PrivacyPolicy.find({});
      return result[0];
};

export const PrivacyPolicyService = {
      createPrivacyPolicyToDB,
      getPrivacyPolicyFromDB,
};
