import { c as create_ssr_component, v as validate_component, d as add_attribute, e as escape } from "../../chunks/ssr.js";
import { A as Accordion, P as Panel, H as Header, C as Content } from "../../chunks/Header.js";
import { B as Button } from "../../chunks/Button.js";
const interviewScreenshot = "/_app/immutable/assets/interview-screenshot.ffca9d86.png";
const setupScreenshot = "/_app/immutable/assets/setup-screenshot.04b3e218.png";
const target = "/_app/immutable/assets/target.88ab3880.svg";
const bookFilled = "/_app/immutable/assets/book-filled.17b4b66a.svg";
const personFilled = "/_app/immutable/assets/person-filled.d31e61ef.svg";
const separator = "/_app/immutable/assets/separator.ae8df4d5.svg";
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: '.jumbotron.svelte-mmubrn.svelte-mmubrn{position:relative;color:#ffffff;z-index:100;padding:200px 40px;background-color:transparent}.jumbotron.svelte-mmubrn.svelte-mmubrn::before{content:"";position:absolute;top:0;left:0;right:0;bottom:0;z-index:-2;background-image:url("$lib/assets/jumbotron.jpg");background-size:cover;background-repeat:no-repeat}.jumbotron.svelte-mmubrn h1.svelte-mmubrn{font-size:42px}.jumbotron.svelte-mmubrn p.svelte-mmubrn{font-size:24px}.announcement-banner.svelte-mmubrn.svelte-mmubrn{text-align:center;font-size:large;display:block;line-height:30px;background-color:#A40080;color:#ffffff}.info-section.svelte-mmubrn.svelte-mmubrn{display:flex;flex-direction:column;width:100%;align-items:center}.info-section.svelte-mmubrn .section.svelte-mmubrn{align-items:center;padding:20px 0;max-width:80%;text-align:center}.info-section.svelte-mmubrn .section.svelte-mmubrn:last-of-type{padding-bottom:60px}.info-section.svelte-mmubrn .vl-section.svelte-mmubrn{padding:0px 50px}.info-section.svelte-mmubrn .horizontal-sections.svelte-mmubrn{display:flex;flex-wrap:wrap;justify-content:space-around}.info-section.svelte-mmubrn .hz-section.svelte-mmubrn{border-radius:8px;flex:1;margin:20px;min-width:200px}.info-section.svelte-mmubrn .hz-section ul.svelte-mmubrn{margin:auto;padding:0}.info-section.svelte-mmubrn .hz-section ul li.svelte-mmubrn{margin-top:10px;display:inline-block}.info-section.svelte-mmubrn .approach.svelte-mmubrn{background-color:#ffffff;justify-content:center}.info-section.svelte-mmubrn .approach img.svelte-mmubrn{margin:10px}.info-section.svelte-mmubrn ul.svelte-mmubrn{list-style-type:none}.info-section.svelte-mmubrn ul li.svelte-mmubrn{text-align:left;margin:10px 0px}',
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const { loggedIn } = data;
  const CONTACT_EMAIL = "concierge@mockinterview.tech";
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `<section class="jumbotron svelte-mmubrn"><div><h1 class="svelte-mmubrn" data-svelte-h="svelte-puuivk">Be On The Ball In Your Next Interview</h1> <p class="svelte-mmubrn" data-svelte-h="svelte-4bawqc">Let us help you make your story as exceptional as you are</p> ${loggedIn ? `<a data-sveltekit-preload-data href="/interview">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `New Interview`;
    }
  })}</a> <a data-sveltekit-preload-data href="/summary">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Review Interviews`;
    }
  })}</a>` : `<a href="/login">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Get Started!`;
    }
  })}</a> <a href="/login">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Log In`;
    }
  })}</a>`}</div></section> ${!loggedIn ? `<div class="announcement-banner svelte-mmubrn" data-svelte-h="svelte-1tmc1x5">Early Adopter Special: Sign up now and get 3 FREE interview questions!</div>` : ``} <div class="info-section svelte-mmubrn"><section class="section svelte-mmubrn" data-svelte-h="svelte-1iloilp"><div class="container"><h1>Why Us?</h1> <div class="vertical-sections"><div class="vl-section svelte-mmubrn"><p>We believe career mobility should be accessible to all. That&#39;s why we use our experience in interviewing and hiring at top companies to give you personalized insights to your stories as hiring managers would see and evaluate them.</p></div></div></div></section> <section class="section svelte-mmubrn" data-svelte-h="svelte-5viwo0"><div class="horizontal-sections svelte-mmubrn"><div class="hz-section svelte-mmubrn"><img width="100px" height="100px"${add_attribute("src", personFilled, 0)} alt="personalized coaching" class="svelte-mmubrn"> <h2>Flexible Coaching</h2> <ul class="svelte-mmubrn"><li class="svelte-mmubrn">Get affordable anyime coaching works with your schedule</li> <li class="svelte-mmubrn">Personalized score cards in storytelling and core skills focus areas track how well your story improves with each attempt</li></ul></div> <div class="hz-section svelte-mmubrn"><img width="100px" height="100px"${add_attribute("src", bookFilled, 0)} alt="high impact story telling" class="svelte-mmubrn"> <h2>Storytelling S.T.A.R</h2> <ul class="svelte-mmubrn"><li class="svelte-mmubrn">Craft your story using the Situation Task Action &amp; Result (S.T.A.R.) framework, the prefered framework of hiring managers</li> <li class="svelte-mmubrn">See specific areas of your story that need more (or less) details and prepare supporting data and points for the real interview</li></ul></div> <div class="hz-section svelte-mmubrn"><img width="100px" height="100px"${add_attribute("src", target, 0)} alt="progression" class="svelte-mmubrn"> <h2>Focused Questions</h2> <ul class="svelte-mmubrn"><li class="svelte-mmubrn">Choose a focus area from grading rubrics used at thousands of companies to interview against</li> <li class="svelte-mmubrn">Understand signals that hiring managers use to evaluate you in areas like <strong>collaboration, problem solving, and influence without authority</strong></li></ul></div></div></section> <img width="50%"${add_attribute("src", separator, 0)} alt="separator" class="svelte-mmubrn"> <section class="section svelte-mmubrn" data-svelte-h="svelte-123kxf4"><div class="container"><h2>Our Approach</h2> <div style="box-shadow: 5px 5px #EDECF2; margin-bottom: 20px; border: 1px solid #EDECF2" class="horizontal-sections svelte-mmubrn"><div class="hz-section approach svelte-mmubrn" style="text-align: center;"><img width="100%"${add_attribute("src", setupScreenshot, 0)} alt="Setup Screenshot" class="svelte-mmubrn"></div> <div class="hz-section approach svelte-mmubrn" style="text-align: left;"><h3>Focus on Skill Areas That Matter to Hiring Managers</h3> <p>We don&#39;t use a question bank and randomly pick questions. We know what interpersonal skills hiring managers truly care about and emphasize story telling in those areas.</p> <p>Training with us will help you recognize what a hiring manager is really looking for in a question so you can deliver the story that best showcases the skill.</p> <p>We score you on how well your story showcases skills like collaboration, leadership, and problem solving and let you re-try questions in an area until you feel confident and ready for the interview.</p></div></div> <div style="box-shadow: 5px 5px #EDECF2; margin-bottom: 20px; border: 1px solid #EDECF2" class="horizontal-sections svelte-mmubrn"><div class="hz-section approach svelte-mmubrn" style="text-align: left;"><h3>Practical Practice</h3> <p>We encourage speaking and practicing as if you were on a call with a real interviewer to build confidence and muscle memory.</p> <p>Filler words are filtered out so you can focus on your story&#39;s content rather than the mechanics.</p> <p>Transcripts are saved so you can review them, make changes, and hone your story.</p></div> <div class="hz-section approach svelte-mmubrn" style="text-align: center;"><img width="100%"${add_attribute("src", interviewScreenshot, 0)} alt="Meta Logo" class="svelte-mmubrn"></div></div></div></section> <img width="50%"${add_attribute("src", separator, 0)} alt="separator" class="svelte-mmubrn"> <section class="section svelte-mmubrn"><h2 data-svelte-h="svelte-ibq37k">Pricing</h2> <p data-svelte-h="svelte-1hoh0s2">All packages come with result summaries. Credits never expire.</p> <div class="horizontal-sections svelte-mmubrn"><div class="hz-section svelte-mmubrn"><h3 style="text-wrap: nowrap;" data-svelte-h="svelte-fiqw7p">Looking Around $5.00</h3> <img width="50%"${add_attribute("src", separator, 0)} alt="separator" class="svelte-mmubrn"> <ul class="svelte-mmubrn" data-svelte-h="svelte-92xuof"><li class="svelte-mmubrn">1 Interview Question</li></ul> <a${add_attribute("href", loggedIn ? "/credits" : "/login", 0)}>${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Buy Now`;
    }
  })}</a></div> <div class="hz-section svelte-mmubrn"><h3 style="text-wrap: nowrap;" data-svelte-h="svelte-yzx5n6">Passive Candidate $20.00</h3> <img width="50%"${add_attribute("src", separator, 0)} alt="separator" class="svelte-mmubrn"> <ul class="svelte-mmubrn" data-svelte-h="svelte-1j6x8rw"><li class="svelte-mmubrn">5 Interview Questions</li></ul> <a${add_attribute("href", loggedIn ? "/credits" : "/login", 0)}>${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Buy Now`;
    }
  })}</a></div> <div class="hz-section svelte-mmubrn"><h3 style="text-wrap: nowrap;" data-svelte-h="svelte-1p62jri">Active Candidate $30.00</h3> <img width="50%"${add_attribute("src", separator, 0)} alt="separator" class="svelte-mmubrn"> <ul class="svelte-mmubrn" data-svelte-h="svelte-2xsska"><li class="svelte-mmubrn">10 Interview Questions</li></ul> <a${add_attribute("href", loggedIn ? "/credits" : "/login", 0)}>${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Buy Now`;
    }
  })}</a></div></div> <div class="hz-section svelte-mmubrn"><h3 data-svelte-h="svelte-1ml7udu">Live Coaching</h3> <p data-svelte-h="svelte-44cm00">Contact us for a consultation with one of our interview experts and we&#39;ll work with you on your career goals and craft an interviewing plan that is perfect for you.</p> <a href="${"mailto:" + escape(CONTACT_EMAIL, true)}">${validate_component(Button, "Button").$$render($$result, {}, {}, {
    default: () => {
      return `Get in Touch`;
    }
  })}</a></div></section> <img width="50%"${add_attribute("src", separator, 0)} alt="separator" class="svelte-mmubrn"> <section class="section svelte-mmubrn"><div class="container"><h2 data-svelte-h="svelte-41559e">Frequently Asked Questions</h2> <div class="horizontal-sections svelte-mmubrn">${validate_component(Accordion, "Accordion").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `Do credits expire?`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p data-svelte-h="svelte-b7u79f">No, however we&#39;re unable to give refunds at this time.</p>`;
            }
          })}`;
        }
      })} ${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `Is my data safe and private?`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p data-svelte-h="svelte-1u63a9e">Absolutely! Mockinterview.tech was built using the most up to date security and privacy best practices by people who&#39;ve worked in the cybersecurity industry. We will not transmit any data you give us without your permission.</p>`;
            }
          })}`;
        }
      })} ${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `I left my session mid-interview. Can I get my token back?`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p>Right now we don&#39;t have a self serve way to do that but if you <a href="${"mailto:" + escape(CONTACT_EMAIL, true)}">drop us a line</a> we can get you squared away.</p>`;
            }
          })}`;
        }
      })} ${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `How do I shut down my account?`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p>We&#39;d be sorry to see you go, however, just <a href="${"mailto:" + escape(CONTACT_EMAIL, true)}">drop us a line</a> we can close out your account including erasure of your data.</p>`;
            }
          })}`;
        }
      })} ${validate_component(Panel, "Panel").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Header, "Header").$$render($$result, {}, {}, {
            default: () => {
              return `Why not just use ChatGPT?`;
            }
          })} ${validate_component(Content, "Content").$$render($$result, {}, {}, {
            default: () => {
              return `<p data-svelte-h="svelte-194pm7u">We leverage exclusive, interview evaluation metrics honed from years of practical, in-depth experience - an expertise extending beyond what ChatGPT can deliver alone. 
We engineered mock interview to not only provide detailed and customized feedback, but also to monitor your progress. Mock Interview embodies the essence of hundreds of hours of research and development, converging to forge a best-in-class AI-driven behavioral interview simulator.</p>`;
            }
          })}`;
        }
      })}`;
    }
  })}</div></div></section> </div>`;
});
export {
  Page as default
};
