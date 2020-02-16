import { functions } from "firebase";
import SiteMetaInfo from "@/models/SiteMetaInfo";

const REGEX = /http(s):\/\//;

// ローカルのエミュレーターに対してFunctionsを呼ぶ場合はuseFunctionsEmulator
// しておかないとダメ
if (process.env.VUE_APP_FUNCTIONS_LOCAL_EMULATOR) {
  functions().useFunctionsEmulator(
    process.env.VUE_APP_FUNCTIONS_LOCAL_EMULATOR
  );
}

function getDomain(url: string): string {
  const withoutProtocol = url.replace(REGEX, "");
  const slashIndex = withoutProtocol.indexOf("/");
  if (slashIndex < 0) {
    return withoutProtocol;
  } else {
    return withoutProtocol.substring(0, slashIndex);
  }
}

/**
 * FaviconのURLを取得する
 *
 * @param url URL
 */
export function getFaviconUrl(url: string): string {
  const domain = getDomain(url);
  if (!domain) {
    return "";
  }
  return `https://www.google.com/s2/favicons?domain=${domain}`;
}

/**
 * サイトメタ情報を取得する
 *
 * @param url URL
 */
export async function getMetaInfo(url: string): Promise<SiteMetaInfo> {
  const result = await functions().httpsCallable("metaInfo")({ url });
  return result.data;
}
