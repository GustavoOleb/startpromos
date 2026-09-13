import { validateAffiliateUrl, type AffiliateNetwork } from "./affiliate-networks.ts";

export type AffiliateLinkDraft = {
  affiliateUrl: string;
  network: AffiliateNetwork;
  status: "draft";
  enrichmentStatus: "pending_enrichment";
  source: "manual-affiliate-link";
  importedAt: string;
  rejectionReasons: string[];
};

export type DraftBatchReport = {
  received: number;
  created: AffiliateLinkDraft[];
  published: string[];
  duplicates: string[];
  rejected: Array<{ url: string; reasons: string[] }>;
};

export const SHEIN_AFFILIATE_LINKS = [
  "https://onelink.shein.com/52/61t5km4mt43s?ismg_ol=6GnqQuGSg2Q_01_KOC-C",
  "https://onelink.shein.com/52/61t5ml5qwhwf?ismg_ol=4tH9luij7Uq_01_KOC-C",
  "https://onelink.shein.com/52/61t5nskfdpb8?ismg_ol=DP4MqgyPBbf_01_KOC-C",
  "https://onelink.shein.com/52/61t5o8co9frn?ismg_ol=KMxWtdK3VJT_01_KOC-C",
  "https://onelink.shein.com/52/61t5oq3yamtn?ismg_ol=8haCfEWIraf_01_KOC-C",
  "https://onelink.shein.com/52/61t5p1y4y9gn?ismg_ol=941f2H6LamX_01_KOC-C",
  "https://onelink.shein.com/52/61t5pfrcqn8u?ismg_ol=1pZIEujNX7f_01_KOC-C",
  "https://onelink.shein.com/52/61t5ptkkhmhr?ismg_ol=H62bIYnVvVm_01_KOC-C",
  "https://onelink.shein.com/52/61t5q9cte29u?ismg_ol=IZhXY7YcV06_01_KOC-C",
  "https://onelink.shein.com/52/61t5qn618jz6?ismg_ol=IoCaWViXejT_01_KOC-C",
  "https://onelink.shein.com/52/61t5qz07wvt2?ismg_ol=8Qng7wwoQZj_01_KOC-C",
  "https://onelink.shein.com/52/61t5rauej3wg?ismg_ol=BtrmvJ5RoAn_01_KOC-C",
  "https://onelink.shein.com/52/61t5ronmdliv?ismg_ol=LURtoWZNc8I_01_KOC-C",
  "https://onelink.shein.com/52/61t5ryirvrkl?ismg_ol=3x63O57aY6E_01_KOC-C",
  "https://onelink.shein.com/52/61t5sacyksnu?ismg_ol=FhXxuK6KWHT_01_KOC-C",
  "https://onelink.shein.com/52/61t5sm7594k4?ismg_ol=HaiI0m6by78_01_KOC-C",
  "https://onelink.shein.com/52/61t5t00d27mv?ismg_ol=BIgtD9PdZrM_01_KOC-C",
  "https://onelink.shein.com/52/61t5tbujr8u5?ismg_ol=Agv1eRPe09o_01_KOC-C",
  "https://onelink.shein.com/52/61t5tlppa46m?ismg_ol=L1RT52x6j1O_01_KOC-C",
  "https://onelink.shein.com/52/61t5txjvxqpc?ismg_ol=LEeuR5iEz5r_01_KOC-C",
  "https://onelink.shein.com/52/61t5u9e2nh2s?ismg_ol=5saFcqfexZV_01_KOC-C",
  "https://onelink.shein.com/52/61t5ur5cnyu0?ismg_ol=06oYusqTXWz_01_KOC-C",
  "https://onelink.shein.com/52/61t5v8wmnrb9?ismg_ol=HIRfo39O8C6_01_KOC-C",
  "https://onelink.shein.com/52/61t5vmpuhjrg?ismg_ol=Ch3ALMSOo7a_01_KOC-C",
  "https://onelink.shein.com/52/61t5w2i3dzks?ismg_ol=FLviLXlGdbA_01_KOC-C",
  "https://onelink.shein.com/52/61t5weca0wto?ismg_ol=1tNqPYZ2g52_01_KOC-C",
] as const;

export const SHEIN_AFFILIATE_LINKS_SECOND_BATCH = [
  "https://onelink.shein.com/52/61t68mc64g0h?ismg_ol=EQGM2IBCS4Z_01_KOC-C",
  "https://onelink.shein.com/52/61t6981iegdu?ismg_ol=CManBgX8UXh_01_KOC-C",
  "https://onelink.shein.com/52/61t6a9j3isou?ismg_ol=IwL1cgodGmW_01_KOC-C",
  "https://onelink.shein.com/52/61t6apbcgmyt?ismg_ol=C7HQJfVop2J_01_KOC-C",
  "https://onelink.shein.com/52/61t6botwfin3?ismg_ol=CoHzWM8K2RL_01_KOC-C",
  "https://onelink.shein.com/52/61t6c2n48lua?ismg_ol=ExZT18mFBMz_01_KOC-C",
  "https://onelink.shein.com/52/61t6ckee8e8h?ismg_ol=EUdS5gK0D6G_01_KOC-C",
  "https://onelink.shein.com/52/61t6cy7m2vyx?ismg_ol=1nJKHLFtkBa_01_KOC-C",
  "https://onelink.shein.com/52/61t6dc0tv9rw?ismg_ol=E3LuNPEHLZC_01_KOC-C",
  "https://onelink.shein.com/52/61t6dvr4yey7?ismg_ol=A5tKd3YnX7X_01_KOC-C",
  "https://onelink.shein.com/52/61t6f73vp4xk?ismg_ol=0Yb9TTayg1q_01_KOC-C",
  "https://onelink.shein.com/52/61t6fkx3g48o?ismg_ol=3A60RmQ44Xd_01_KOC-C",
  "https://onelink.shein.com/52/61t6g2odhb8e?ismg_ol=4dY8MOPUQUc_01_KOC-C",
  "https://onelink.shein.com/52/61t6geik4xy2?ismg_ol=1VC9lFs738E_01_KOC-C",
  "https://onelink.shein.com/52/61t6gw9u6u57?ismg_ol=JIgMiHg2HEA_01_KOC-C",
  "https://onelink.shein.com/52/61t6h840t25f?ismg_ol=8Ex5B8Hm1Vn_01_KOC-C",
  "https://onelink.shein.com/52/61t6hlx8m5cu?ismg_ol=HehEyqBW1zN_01_KOC-C",
  "https://onelink.shein.com/52/61t6i1phil2y?ismg_ol=4x4vgMQxAe5_01_KOC-C",
  "https://onelink.shein.com/52/61t6idjo67ox?ismg_ol=2Uzrv7pMOEq_01_KOC-C",
  "https://onelink.shein.com/52/61t6ivay8t9f?ismg_ol=CBlez3Cyiew_01_KOC-C",
  "https://onelink.shein.com/52/61t6j945zsl6?ismg_ol=LiOoSE18fE1_01_KOC-C",
  "https://onelink.shein.com/52/61t6jmxdrh86?ismg_ol=DUMzh8RTHg7_01_KOC-C",
  "https://onelink.shein.com/52/61t6k0qllyvr?ismg_ol=LXcmGyTupqd_01_KOC-C",
  "https://onelink.shein.com/52/61t6kejtc8t5?ismg_ol=49XeaIHFkn5_01_KOC-C",
  "https://onelink.shein.com/52/61t6ksd1614i?ismg_ol=ILF79nXTtDx_01_KOC-C",
  "https://onelink.shein.com/52/61t6l477ud0b?ismg_ol=4px2uSbUt3n_01_KOC-C",
  "https://onelink.shein.com/52/61t6li0flc7l?ismg_ol=L0Dw2GnqEgV_01_KOC-C",
  "https://onelink.shein.com/52/61t6lrvl6bgu?ismg_ol=6ZEhEmeYMrE_01_KOC-C",
  "https://onelink.shein.com/52/61t6m5osy00q?ismg_ol=Ha40N1t5m55_01_KOC-C",
  "https://onelink.shein.com/52/61t6mlh1v51s?ismg_ol=0BjBBqXhEGh_01_KOC-C",
  "https://onelink.shein.com/52/61t6mza9o87e?ismg_ol=4mIIpd3sOtl_01_KOC-C",
  "https://onelink.shein.com/52/61t6nb4gb5ha?ismg_ol=8syJcOJc6X5_01_KOC-C",
  "https://onelink.shein.com/52/61t6nmyn0vxo?ismg_ol=FkV1o1jxdqS_01_KOC-C",
  "https://onelink.shein.com/52/61t6nystnt7c?ismg_ol=E5143YXscyX_01_KOC-C",
  "https://onelink.shein.com/52/61t6oan0cuac?ismg_ol=CMFQgUMoWvb_01_KOC-C",
] as const;

export const ALL_SHEIN_AFFILIATE_LINKS = [
  ...SHEIN_AFFILIATE_LINKS,
  ...SHEIN_AFFILIATE_LINKS_SECOND_BATCH,
] as const;

export const SHEIN_PUBLISHED_AFFILIATE_LINKS = [
  "https://onelink.shein.com/52/61t68mc64g0h?ismg_ol=EQGM2IBCS4Z_01_KOC-C",
  "https://onelink.shein.com/52/61t6981iegdu?ismg_ol=CManBgX8UXh_01_KOC-C",
  "https://onelink.shein.com/52/61t6a9j3isou?ismg_ol=IwL1cgodGmW_01_KOC-C",
  "https://onelink.shein.com/52/61t6apbcgmyt?ismg_ol=C7HQJfVop2J_01_KOC-C",
] as const;

export const GUSTAVO_AFFILIATE_LINKS = [
  "https://onelink.shein.com/52/61t6c2n48lua?ismg_ol=ExZT18mFBMz_01_KOC-C",
  "https://onelink.shein.com/52/61t6ckee8e8h?ismg_ol=EUdS5gK0D6G_01_KOC-C",
  "https://onelink.shein.com/52/61t6cy7m2vyx?ismg_ol=1nJKHLFtkBa_01_KOC-C",
  "https://onelink.shein.com/52/61t6dc0tv9rw?ismg_ol=E3LuNPEHLZC_01_KOC-C",
  "https://onelink.shein.com/52/61t6dvr4yey7?ismg_ol=A5tKd3YnX7X_01_KOC-C",
  "https://onelink.shein.com/52/61t6f73vp4xk?ismg_ol=0Yb9TTayg1q_01_KOC-C",
  "https://onelink.shein.com/52/61t6fkx3g48o?ismg_ol=3A60RmQ44Xd_01_KOC-C",
  "https://onelink.shein.com/52/61t6g2odhb8e?ismg_ol=4dY8MOPUQUc_01_KOC-C",
  "https://onelink.shein.com/52/61t6geik4xy2?ismg_ol=1VC9lFs738E_01_KOC-C",
  "https://onelink.shein.com/52/61t6gw9u6u57?ismg_ol=JIgMiHg2HEA_01_KOC-C",
  "https://onelink.shein.com/52/61t6h840t25f?ismg_ol=8Ex5B8Hm1Vn_01_KOC-C",
  "https://onelink.shein.com/52/61t6hlx8m5cu?ismg_ol=HehEyqBW1zN_01_KOC-C",
  "https://onelink.shein.com/52/61t6i1phil2y?ismg_ol=4x4vgMQxAe5_01_KOC-C",
  "https://onelink.shein.com/52/61t6idjo67ox?ismg_ol=2Uzrv7pMOEq_01_KOC-C",
  "https://onelink.shein.com/52/61t6ivay8t9f?ismg_ol=CBlez3Cyiew_01_KOC-C",
  "https://onelink.shein.com/52/61t6j945zsl6?ismg_ol=LiOoSE18fE1_01_KOC-C",
  "https://onelink.shein.com/52/61t6jmxdrh86?ismg_ol=DUMzh8RTHg7_01_KOC-C",
  "https://onelink.shein.com/52/61t6k0qllyvr?ismg_ol=LXcmGyTupqd_01_KOC-C",
  "https://vt.tiktok.com/ZS9S4XjuP7AMK-KUUlb/",
] as const;

export const TIKTOK_AFFILIATE_LINKS = ["https://vt.tiktok.com/ZS9S4XjuP7AMK-KUUlb/"] as const;

export function importAffiliateLinkDrafts(
  urls: readonly string[] = SHEIN_AFFILIATE_LINKS,
  existingUrls: ReadonlySet<string> = new Set(),
  importedAt = new Date().toISOString(),
  publishedUrls: ReadonlySet<string> = new Set(),
): DraftBatchReport {
  const created: AffiliateLinkDraft[] = [];
  const duplicates: string[] = [];
  const rejected: Array<{ url: string; reasons: string[] }> = [];
  const seen = new Set(existingUrls);
  const published: string[] = [];

  for (const url of urls) {
    if (publishedUrls.has(url)) {
      published.push(url);
      continue;
    }
    if (seen.has(url)) {
      duplicates.push(url);
      continue;
    }

    const validation = validateAffiliateUrl(url);
    if (!validation.valid || !validation.network) {
      rejected.push({ url, reasons: [`link afiliado inválido: ${validation.reason ?? "unknown"}`] });
      continue;
    }

    seen.add(url);
    created.push({
      affiliateUrl: url,
      network: validation.network.id,
      status: "draft",
      enrichmentStatus: "pending_enrichment",
      source: "manual-affiliate-link",
      importedAt,
      rejectionReasons: [],
    });
  }

  return { received: urls.length, created, published, duplicates, rejected };
}

export const SHEIN_DRAFT_IMPORT_REPORT = importAffiliateLinkDrafts(
  ALL_SHEIN_AFFILIATE_LINKS,
  new Set(),
  "2026-09-12T00:00:00.000Z",
  new Set(SHEIN_PUBLISHED_AFFILIATE_LINKS),
);

export const GUSTAVO_DRAFT_IMPORT_REPORT = importAffiliateLinkDrafts(
  GUSTAVO_AFFILIATE_LINKS,
  new Set(),
  "2026-09-12T16:05:00.000Z",
  new Set(GUSTAVO_AFFILIATE_LINKS),
);
