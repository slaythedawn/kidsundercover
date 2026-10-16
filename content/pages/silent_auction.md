---
url: /silent_auction/
title: Silent Auction
seoTitle: "Silent Auction Payment"
description: "Pay for your Kids Under Cover silent auction item online."
eyebrow: Congratulations on winning the silent auction!
intro: Please note, this is not a tax deductible donation.
heroImage: https://www.kuc.org.au/wp-content/uploads/2023/07/MicrosoftTeams-image-16.jpg
heroAlt: Supporters in costume at a Kids Under Cover event
section: campaign
cta: none
form: none
related: [/get-involved/donate/, /get-involved/community-fundraising/]
status: live
noindex: true
sections:
  # Payment goes through the live page's Salesforce NPSP Plus form for the silent auction, not the general donation form.
  - type: npsp
    id: pay
    form: a3kMo000004RU69IAG
    eyebrow: Pay for your item
    title: Congratulations on your winning bid
    body: Use the form on this page to pay for your silent auction item.
    note: Please note, this is not a tax deductible donation.

  - type: callout
    tone: card
    icon: heart
    eyebrow: Thank you
    title: Want to do more?
    body: Thank you for supporting Kids Under Cover. If you would like to do more for young people at risk of homelessness, there are other ways to get involved.
    actions:
      - { label: Make a donation, href: /get-involved/donate/, variant: ink }
      - { label: Community fundraising, href: /get-involved/community-fundraising/, variant: ghost }
---
