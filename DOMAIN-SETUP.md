# ceramicsbycaitlin.com

GitHub repository: https://github.com/apantazi/ceramicsbycaitlin

In repository Settings > Pages, select **GitHub Actions** as the source and set the custom domain to **ceramicsbycaitlin.com**.

In Spaceship, open **Domain Manager**, select **ceramicsbycaitlin.com**, and open its DNS management screen. Keep Spaceship DNS unless another DNS provider is already in use.

| Type | Host/name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | apantazi.github.io |

Use the default TTL. Replace conflicting parking records for @ or www; preserve email MX records and unrelated records. Once DNS checks and the certificate finish, enable **Enforce HTTPS** in GitHub Pages settings.

The www CNAME targets the account's github.io domain, without the repository name. GitHub redirects www to the configured apex domain.

Official reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
