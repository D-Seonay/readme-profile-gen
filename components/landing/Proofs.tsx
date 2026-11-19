import { generateMarkdown } from '@/utils/generateMarkdown';
import { T } from './i18n';
import { ChapterHeader } from './Ornaments';
import { ProofCard } from './ProofCard';
import { ReadmeRender } from './ReadmeRender';
import { PROOF_SAMPLES } from './samples';
import { WRAP } from './ui';

/** Final pose of each proof; on wide screens they start stacked in the middle and fan out. */
const POSES = [
  '[--fan-rotate:-1.2deg] lg:[--fan-rotate:-3deg] lg:[--fan-x:62%] lg:mt-10',
  '[--fan-rotate:1deg] lg:[--fan-rotate:1.6deg] lg:mt-28',
  '[--fan-rotate:-0.8deg] lg:[--fan-rotate:2.6deg] lg:[--fan-x:-62%] lg:mt-0',
];

/** §3 — three sample profiles, rendered on the server from the real generator. */
export function Proofs() {
  return (
    <section id="proofs" aria-labelledby="proofs-title" className="overflow-x-clip border-t border-line-strong bg-surface">
      <div className={`${WRAP} py-24 sm:py-28 lg:py-36`}>
        <ChapterHeader
          id="proofs"
          number="3"
          name={<T k="proofs.chapter" />}
          title={<T k="proofs.title" />}
          lede={<T k="proofs.lede" />}
        />
        <div className="mt-16 grid items-start gap-20 mx-3 sm:mx-6 lg:mx-0 lg:mt-20 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {PROOF_SAMPLES.map((sample, index) => {
            const markdown = generateMarkdown(sample.data);
            return (
              <ProofCard
                key={sample.id}
                name={sample.name}
                tag={sample.tag}
                className={POSES[index]}
                front={<ReadmeRender markdown={markdown} />}
                markdown={markdown}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
