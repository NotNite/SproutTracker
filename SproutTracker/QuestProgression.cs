using System;

namespace SproutTracker;

public class QuestProgression {
    public readonly uint Quest;
    public readonly byte Sequence;
    public readonly bool Complete;

    public QuestProgression(uint quest, byte sequence, bool complete) {
        this.Quest = quest;
        this.Sequence = sequence;
        this.Complete = complete;
    }

    protected bool Equals(QuestProgression other) {
        return this.Quest == other.Quest
               && this.Sequence == other.Sequence
               && this.Complete == other.Complete;
    }

    public override bool Equals(object? obj) {
        if (ReferenceEquals(null, obj)) return false;
        if (ReferenceEquals(this, obj)) return true;
        if (obj.GetType() != this.GetType()) return false;
        return Equals((QuestProgression) obj);
    }

    public override int GetHashCode() {
        return HashCode.Combine(this.Quest, this.Sequence, this.Complete);
    }
}
