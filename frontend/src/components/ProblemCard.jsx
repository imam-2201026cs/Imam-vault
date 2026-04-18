import { useNavigate } from 'react-router-dom';

const diffColor = { Easy:'#27500A', Medium:'#633806', Hard:'#791F1F' };
const diffBg    = { Easy:'#EAF3DE', Medium:'#FAEEDA', Hard:'#FCEBEB' };
const platColor = { LeetCode:'#E6F1FB', GFG:'#E1F5EE', HackerRank:'#E1F5EE', Codeforces:'#EEEDFE', Other:'#F1EFE8' };

export default function ProblemCard({ problem }) {
  const navigate = useNavigate();

  const nextReviewDays = problem.nextReview
    ? Math.ceil((new Date(problem.nextReview) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <>
      <style>{`
        .pcard { background:#fff; border:1px solid #e8e8f0; border-radius:12px; padding:1rem 1.25rem; cursor:pointer; transition:border-color .15s, box-shadow .15s; }
        .pcard:hover { border-color:#534AB7; box-shadow:0 2px 8px rgba(83,74,183,.08); }
        .pcard-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; gap:8px; }
        .pcard-title { font-size:15px; font-weight:600; color:#1a1a2e; margin:0; flex:1; min-width:0; word-break:break-word; }
        .pcard-badge { font-size:11px; font-weight:600; padding:3px 10px; border-radius:99px; flex-shrink:0; }
        .pcard-tags { display:flex; flex-wrap:wrap; gap:4px; margin-top:8px; }
        .pcard-tag { font-size:11px; background:#EEEDFE; color:#3C3489; padding:2px 8px; border-radius:99px; }
        .pcard-meta { display:flex; gap:8px; align-items:center; margin-top:10px; flex-wrap:wrap; justify-content:space-between; }
        .pcard-plat { font-size:11px; font-weight:500; padding:2px 8px; border-radius:99px; }
        .pcard-date { font-size:11px; color:#999; }
        .pcard-next-review { font-size:11px; padding:2px 8px; border-radius:99px; font-weight:600; }
      `}</style>
      <div className="pcard" onClick={() => navigate(`/problem/${problem._id}`)}>
        <div className="pcard-top">
          <p className="pcard-title">{problem.title}</p>
          <span className="pcard-badge" style={{ background:diffBg[problem.difficulty], color:diffColor[problem.difficulty] }}>
            {problem.difficulty}
          </span>
        </div>
        {problem.tags?.length > 0 && (
          <div className="pcard-tags">
            {problem.tags.slice(0, 4).map(tag => <span key={tag} className="pcard-tag">{tag}</span>)}
          </div>
        )}
        <div className="pcard-meta">
          <div style={{ display:'flex', gap:6, alignItems:'center', flexWrap:'wrap' }}>
            <span className="pcard-plat" style={{ background:platColor[problem.platform] || '#F1EFE8', color:'#444' }}>
              {problem.platform}
            </span>
            <span className="pcard-date">Solved {new Date(problem.solvedOn).toLocaleDateString()}</span>
          </div>
          {nextReviewDays !== null && (
            <span className="pcard-next-review" style={{
              background: nextReviewDays <= 0 ? '#FCEBEB' : nextReviewDays <= 3 ? '#FAEEDA' : '#EAF3DE',
              color: nextReviewDays <= 0 ? '#791F1F' : nextReviewDays <= 3 ? '#633806' : '#27500A'
            }}>
              {nextReviewDays <= 0 ? '⚡ Due now' : nextReviewDays === 1 ? '📅 Due tomorrow' : `📅 Due in ${nextReviewDays}d`}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
