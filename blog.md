---
layout: page
title: Technical Writeups
permalink: /blog/
---

# Technical Writeups

Here you'll find my deep-dives into algorithms and system design.

{% for post in site.posts %}
### [{{ post.title }}]({{ post.url }})
*Published on {{ post.date | date_no_string: "%b %d, %Y" }}*
{{ post.excerpt | strip_html | truncatewords: 30 }}
---
{% endfor %}